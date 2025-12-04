import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPhone, faShieldAlt, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { BookDTO } from 'src/app/models/BookDTO ';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;
  coverImage?: File;
  pdfFile?: File;
  successMessage = '';
  errorMessage = '';
  availableGenres: string[] = [];
  selectedGenres: string[] = [];
  formSubmitted = false;
  newGenre = '';
  genreAddMessage = '';
  genreAddError = '';

  // Font Awesome icons (keep your existing icons)

  constructor(
    private fb: FormBuilder,
    private bookService: BookService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadGenres();
  }

  initializeForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      author: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      description: ['', [
        Validators.maxLength(1000)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999.99)
      ]],
      isbn: ['', [
        Validators.required,
        Validators.pattern(/^(?:\d{6}|\d{8})$/)
      ]],
      genres: [[], Validators.required]
    });
  }

  loadGenres(): void {
    this.bookService.getAllGenres().subscribe({
      next: (genres) => {
        this.availableGenres = genres;
      },
      error: (error) => {
        console.error('Genre load error:', error);
        this.availableGenres = ['Fiction', 'Non-Fiction', 'Science', 'Biography'];
      }
    });
  }

  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2097152) { // 2MB
        this.errorMessage = 'Image must be less than 2MB';
        return;
      }
      if (!file.type.match('image.*')) {
        this.errorMessage = 'Only image files are allowed';
        return;
      }
      this.coverImage = file;
      this.errorMessage = '';
    }
  }

  onPdfFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10485760) { // 10MB
        this.errorMessage = 'PDF must be less than 10MB';
        return;
      }
      if (!file.name.endsWith('.pdf')) {
        this.errorMessage = 'Only PDF files are allowed';
        return;
      }
      this.pdfFile = file;
      this.errorMessage = '';
    }
  }

  toggleGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);
    if (index === -1) {
      this.selectedGenres.push(genre);
    } else {
      this.selectedGenres.splice(index, 1);
    }
    this.bookForm.patchValue({
      genres: this.selectedGenres
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (!this.coverImage || !this.pdfFile) {
      this.errorMessage = 'Both cover image and PDF file are required';
      return;
    }

    if (this.bookForm.invalid) {
      this.errorMessage = 'Please correct the form errors';
      return;
    }

    const bookData: BookDTO = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      description: this.bookForm.value.description,
      price: this.bookForm.value.price,
      isbn: this.bookForm.value.isbn,
      genres: this.selectedGenres
    };

    this.bookService.createBook(bookData, this.coverImage, this.pdfFile).subscribe({
      next: () => {
        this.successMessage = 'Book created successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = 'Error creating book: ' + (error.error?.message || error.message);
        this.successMessage = '';
      }
    });
  }

  resetForm(): void {
    this.bookForm.reset({
      title: '',
      author: '',
      description: '',
      price: 0,
      isbn: '',
      genres: []
    });
    this.selectedGenres = [];
    this.coverImage = undefined;
    this.pdfFile = undefined;
    this.formSubmitted = false;
  }

  addNewGenre(): void {
    if (!this.newGenre.trim()) {
      this.genreAddError = 'Genre name cannot be empty.';
      this.genreAddMessage = '';
      return;
    }

    this.bookService.addGenre(this.newGenre.trim()).subscribe({
      next: (response) => {
        this.genreAddMessage = response;
        this.genreAddError = '';
        this.newGenre = '';
        this.loadGenres();
      },
      error: (error) => {
        this.genreAddError = error.error || 'Failed to add genre';
        this.genreAddMessage = '';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
   fauser = faUser;
  fabox = faBox;
  faedit = faEdit;
  fagroup=faComments;
  fapub=faNewspaper;
  famiss=faListCheck;
  faCalendarAlt = faCalendarAlt;
  fatrash = faTrash;
  facircle = faCircle;
  faArrowLeft = faArrowAltCircleLeft;
  faPhone = faPhone;
  faShieldAlt = faShieldAlt;
  fadoor = faDoorOpen;
  fanot = faBell;
  fabook = faBook;
  faenv = faEnvelope;
  fashield = faShieldAlt;
  faTrophy = faTrophy;

}
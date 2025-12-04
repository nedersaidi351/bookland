// edit-book.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDTO } from 'src/app/models/BookDTO ';
import { faArrowLeft, faBell, faBook, faBox, faComments, faDoorOpen, faListCheck, faNewspaper, faShieldAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  book: BookDTO | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(+id).subscribe({
        next: (book) => {
          this.book = book;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load book';
          this.isLoading = false;
        }
      });
    }
  }

 coverImageFile: File | null = null;
pdfFile: File | null = null;

onCoverImageChange(event: Event): void {
  const element = event.target as HTMLInputElement;
  if (element.files && element.files.length > 0) {
    this.coverImageFile = element.files[0];
  }
}

onPdfFileChange(event: Event): void {
  const element = event.target as HTMLInputElement;
  if (element.files && element.files.length > 0) {
    this.pdfFile = element.files[0];
  }
}

handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/no-cover.jpg';
}

updateBook(): void {
  if (this.book && this.book.id) {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Here you would need to implement the actual update logic
    // including handling file uploads if needed
    this.bookService.updateBook(this.book.id, this.book).subscribe({
      next: () => {
        this.router.navigate(['/book-list']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update book';
        this.isLoading = false;
      }
    });
  }
}
fauser=faUser;
  fabox=faBox;
  fabook=faBook;
  fanot=faBell;
  famiss=faListCheck;
  faArrowLeft=faArrowLeft;
  fashield=faShieldAlt;
  fagroup=faComments;
  fapub=faNewspaper;
  fadoor=faDoorOpen;
    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      }
}
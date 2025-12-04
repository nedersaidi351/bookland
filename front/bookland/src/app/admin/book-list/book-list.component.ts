import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environment';
import { BookDTO } from 'src/app/models/BookDTO ';
import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPhone, faPlus, faShield, faShieldAlt, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: BookDTO[] = [];
  isLoading = false;
  errorMessage = '';
  imageError = false;
  apiUrl = environment.apiUrl; // Add this line

  constructor(private bookService: BookService,private router: Router) { }

  ngOnInit(): void {
    this.loadBooks();
  }

// In book-list.component.ts
loadBooks(): void {
  this.bookService.getAllBooks().subscribe({
    next: (books) => {
      this.books = books.map(book => ({
        ...book,
        coverImageUrl: this.bookService.getCoverImageUrl(book.id!),
        pdfUrl: book.pdfFilePath ? 
          this.bookService.getFileUrl(book.pdfFilePath) : 
          undefined
      }));
    }
  });
}

handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.error('Image load failed:', {
    src: img.src,
    currentSrc: img.currentSrc,
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight
  });

  // Set fallback image
 
}

  // In book-list.component.ts
// In book-list.component.ts
checkPdfLink(event: Event, book: BookDTO) {
  event.preventDefault();
  
  if (!book.pdfUrl) {
    this.errorMessage = 'PDF not available';
    return;
  }

  // Verify URL doesn't contain double paths
  if (book.pdfUrl.includes('/api/files/api/files/')) {
    const correctedUrl = book.pdfUrl.replace('/api/files/api/files/', '/api/files/');
    window.open(correctedUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
}
deleteBook(bookId: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      this.errorMessage = '';

      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== bookId);
          this.isLoading = false;
          Swal.fire(
            'Deleted!',
            'Book and associated purchases deleted successfully.',
            'success'
          );
        },
        error: (err) => {
          this.errorMessage = err.error || 'Failed to delete book';
          this.isLoading = false;
          console.error('Delete error:', err);
          Swal.fire(
            'Error!',
            this.errorMessage,
            'error'
          );
        }
      });
    }
  });
}


editBook(bookId: number): void {
  this.router.navigate(['/edit-book', bookId]);
}
///////////---////
fagroup=faComments;
  fapub=faNewspaper;
 fauser = faUser;
  fabox = faBox;
  faedit = faEdit;
  faCalendarAlt = faCalendarAlt;
  fatrash = faTrash;
  facircle = faCircle;
  famiss=faListCheck;
  faArrowLeft = faArrowAltCircleLeft;
  faPhone = faPhone;
  faShieldAlt = faShieldAlt;
  fadoor = faDoorOpen;
  fanot=faBell;
  fabook=faBook;
  fashield=faShieldAlt;
  faenv=faEnvelope;
  faTrophy=faTrophy;
  faplus=faPlus;
  
   logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      }
}
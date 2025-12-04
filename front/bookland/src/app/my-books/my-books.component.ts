import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { BookDTO } from '../models/BookDTO ';
import Swal from 'sweetalert2';
import { finalize, map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../serives/authentication.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.css']
})
export class MyBooksComponent implements OnInit {
  purchasedBooks: BookDTO[] = [];
  loading = true;
  error = '';

  constructor(private authService: AuthenticationService,private location: Location,private http: HttpClient, private notificationService: NotificationService,private userService: UserService, private router: Router,private bookservice: BookService) {}
  ngOnInit(): void {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      this.loadPurchasedBooks(userEmail);
    }
  }
goBack(): void {
  this.location.back();
}
faarrow=faArrowLeft;
navigateTomarket() {
      this.router.navigate(['/market']);
    }
    navigateTomessage() {
      this.router.navigate(['/message']);
    }
    navigateTomission() {
      this.router.navigate(['/mission']);
    }
    navigateTohome() {
      this.router.navigate(['/home']);
    }



loadPurchasedBooks(email: string): void {
  // Validate email first
  if (!email || !this.validateEmail(email)) {
    this.error = 'Please provide a valid email address';
    this.loading = false;
    return;
  }

  this.loading = true;
  this.error = '';
  
  this.bookservice.getPurchasedBooks(email).pipe(
    map(books => books.map(book => ({
      ...book,
      coverImageUrl: this.bookservice.getCoverImageUrl(book.id!),
      pdfUrl: book.pdfFilePath ? this.bookservice.getFileUrl(book.pdfFilePath) : undefined
    }))),
    finalize(() => this.loading = false)
  ).subscribe({
    next: (books) => {
      this.purchasedBooks = books;
    },
    error: (err) => {
      console.error('Error loading purchased books:', err);
      let errorMsg = 'Failed to load your purchased books. Please try again.';
      
      // Provide more specific error messages based on status code
      if (err.status === 500) {
        errorMsg = 'Server error occurred. Please try again later.';
      } else if (err.status === 404) {
        errorMsg = 'No purchased books found.';
      } else if (err.status === 401 || err.status === 403) {
        errorMsg = 'Authentication required. Please log in again.';
      }
      
      this.error = errorMsg;
      Swal.fire('Error', errorMsg, 'error');
    }
  });
}

// Simple email validation
private validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


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
  errorMessage = '';




// Handle image loading errors
handleImageError(event: any): void {
  event.target.src = 'assets/default-book-cover.png';
}

// Retry loading books
retryLoading(): void {
  this.error = '';
  const email = localStorage.getItem('email');
  if (email) this.loadPurchasedBooks(email);
}

// Download book PDF
downloadBook(book: BookDTO): void {
  if (book.pdfUrl) {
    const link = document.createElement('a');
    link.href = book.pdfUrl;
    link.download = `${book.title}.pdf`;
    link.click();
  }
}
// In my-books.component.ts
filterBooks(event: Event): void {
  const term = (event.target as HTMLInputElement).value.toLowerCase();
  // Implement your filtering logic
}


}
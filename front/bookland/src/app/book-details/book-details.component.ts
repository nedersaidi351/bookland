import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { faShoppingCart, faDownload, faArrowLeft, faHeart, faBarcode, faCalendarAlt, faTags, faGear, faList, faUser, faDoorOpen, faComment, faShop, faClock, faBook, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { BookDTO } from '../models/BookDTO ';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { finalize, map } from 'rxjs';
 // Ensure you have this model
interface Notification {
  id: number;
  recipientEmail: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  expanded?: boolean; // Added for UI state
}
@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: BookDTO | null = null;
  loading = true;
  error: string | null = null;
  isPurchased = false;
  coverImageUrl: string = '';
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

  // FontAwesome icons
  fashop = faShoppingCart;
  fadownload = faDownload;
  faleft = faArrowLeft;
  faheart = faHeart;
  fabarc = faBarcode;
  facalender = faCalendarAlt;
  fatags = faTags;
  fauser=faUser;
       fadoor=faDoorOpen;
       isScrolled=false;
       faset=faGear;
       fabar=faList;
       facom=faComment;
       famarket=faShop;
       faclock=faClock;
       fabook=faBook;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
     this.http.get(`http://localhost:8088/api/v1/image?email=${this.userEmail}`, { responseType: 'blob' })
    .subscribe(blob => {
      this.imageUrl = URL.createObjectURL(blob);
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const bookId = +id;
      this.loadBookDetails(bookId);
      this.checkPurchaseStatus(bookId);
      const email = localStorage.getItem('email');
    if (email) {
      this.userEmails = email;
      this.loadNotifications();
    }
    }
     const userEmail = localStorage.getItem('email');
    if (userEmail) {
      this.loadPurchasedBooks(userEmail);
    }
    
    
  }

  loadBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
        this.coverImageUrl = this.bookService.getCoverImageUrl(book.id!); // Generate cover URL
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load book details';
        this.loading = false;
      }
    });
  }

  checkPurchaseStatus(bookId: number): void {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      this.bookService.checkPurchaseStatus(bookId, userEmail).subscribe({
        next: (purchased) => this.isPurchased = purchased,
        error: (err) => console.error('Error checking purchase status:', err)
      });
    }
  }

  openPaymentModal(): void {
    this.router.navigate(['/market'], { 
      state: { showPaymentModal: true, selectedBook: this.book } 
    });
  }

  downloadBook(): void {
    if (this.book?.pdfFilePath) {
      window.open(this.book.pdfFilePath, '_blank', 'noopener,noreferrer');
    }
  }

  addToWishlist(): void {
    Swal.fire({
      title: 'Added to Wishlist',
      text: `${this.book?.title} has been added to your wishlist`,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  goBack(): void {
    this.location.back();
  }
  logout(){
           localStorage.removeItem('token');
           this.router.navigate(['/login']);
         }
         isOpen = false;
     
       toggleDropdown(): void {
         this.isOpen = !this.isOpen;
       }
     
       closeDropdown(): void {
         this.isOpen = false;
       }
     
       // Close dropdown when clicking outside
       @HostListener('document:click', ['$event'])
       onClick(event: MouseEvent): void {
         const target = event.target as HTMLElement;
         if (!target.closest('.dropdown')) {
           this.isOpen = false;
         }
       }
     
       navigateToStopwatch() {
         this.router.navigate(['/timer']);
       }
       gomybook(){
        this.router.navigate(['/book']);
       }
  

       //////Not
        showNotifications = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  errorMessage = '';
    userEmails = '';
  
    toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.isLoading = true;
    this.errorMessage = '';

    this.notificationService.getUnreadNotifications(this.userEmails).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications', err);
        this.errorMessage = 'Failed to load notifications';
        this.isLoading = false;
      }
    });
  }

  viewNotification(notification: Notification) {
    // Implement what happens when a notification is clicked
    if (!notification.isRead) {
      this.markAsRead(notification.id);
    }
    // Additional logic like navigating to a specific page
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          this.notifications[index].isRead = true;
          this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        }
      },
      error: (err) => {
        console.error('Error marking as read', err);
      }
    });
  }
   userEmail = localStorage.getItem('email');
    selectedFile!: File;
    imageUrl: string = '';
    localStorageEmail: string | null = null;
    isLoading = false;

    currentUserEmail: string = ''; // Add this line
      handleImageError() {
  this.imageUrl = 'assets/img/avatar.svg';
}
 uploadImage() {
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('email', this.userEmail || '');
  
    this.http.post('http://localhost:8088/api/v1/upload-image', formData)
      .subscribe({
        next: () => alert('Image uploaded successfully'),
        error: err => console.error('Upload failed:', err)
      });
  }
  fastar=faStar;
  fastarhalf=faStarHalf;


  ////payman
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
  private validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
purchasedBooks: BookDTO[] = [];

 loadPurchasedBooks(email: string): void {
   // Validate email first
   if (!email || !this.validateEmail(email)) {
     this.error = 'Please provide a valid email address';
     this.loading = false;
     return;
   }
 
   this.loading = true;
   this.error = '';
   
   this.bookService.getPurchasedBooks(email).pipe(
     map(books => books.map(book => ({
       ...book,
       coverImageUrl: this.bookService.getCoverImageUrl(book.id!),
       pdfUrl: book.pdfFilePath ? this.bookService.getFileUrl(book.pdfFilePath) : undefined
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
}

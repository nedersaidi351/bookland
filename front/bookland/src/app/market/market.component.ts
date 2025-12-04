import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { VerificationRequest } from '../models/verification-request';
import { Router } from '@angular/router';
import { AuthenticationService } from '../serives/authentication.service';
import { AuthenticationResponse } from '../models/authentication-response';
import { RegisterRequest } from '../models/register-request';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook, faEdit, faBarcode, faShoppingCart, faInfoCircle, faHeart, faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import { ChatbotService } from '../services/chatbot.service';
import { Post } from '../models/Post';
import { BlogService } from '../services/blog.service';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { BookDTO } from '../models/BookDTO ';
import { BookService } from '../services/book.service';
import { environment } from '../environment';
import { Genre } from '../models/genre';


interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  lang?: string;
  translated?: boolean;
}
interface Notification {
  id: number;
  recipientEmail: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  expanded?: boolean; // Added for UI state
}

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  userEmail = localStorage.getItem('email');
  selectedFile!: File;
  imageUrl: string = '';
  localStorageEmail: string | null = null;
  posts: Post[] = [];
  currentUserEmail: string = ''; // Add this line
   
  handleImageError() {
  this.imageUrl = 'assets/img/avatar.svg';
}
  // Remove email from form since we'll get it automatically
  postForm = this.fb.group({
    content: ['', Validators.required]
  });

  
  likePost(post: Post): void {
    const email = localStorage.getItem('email');
    if (!email) return;
  
    this.blogService.likePost(post.id, email).subscribe({
      next: (updatedPost) => {
        post.likeCount = updatedPost.likeCount;
        post.likeCount += 1;
        Swal.fire({
          title: 'You liked this post!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        if (err === 'You already liked this post.') {
          Swal.fire({
            title: 'You already liked this post!',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        } 
      }
    });
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


  onSubmit(): void {
    const savedEmail = localStorage.getItem('email');
    if (this.postForm.valid && savedEmail) {
      const postData = {
        content: this.postForm.value.content!,
        user: { email: savedEmail }
      };
  
      this.blogService.createPost(postData).subscribe({
        next: (newPost) => {
          // Add the new post to the beginning of the posts array
          this.posts.unshift({
            ...newPost,
            likedByCurrentUser: false, // Default to not liked
            likeCount: 0              // Default to 0 likes
          });
          
          // Reset the form
          this.postForm.reset();
          
          // Show success message
          Swal.fire({
            title: 'Success!',
            text: 'Your post has been created.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (err) => {
          console.error('Error creating post:', err);
          Swal.fire('Error', 'Failed to create post. Please try again.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Please write something to post.', 'warning');
    }
  }
  
  

  loadPosts(): void {
    const email = localStorage.getItem('email');
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.map(post => {
          post.likedByCurrentUser = (post as any)['likedByEmails']?.includes(email);
          return post;
        });
      },
      error: (error) => {
        console.error('Error loading posts', error);
        Swal.fire('Error', 'Failed to load posts. Please refresh the page.', 'error');
      }
    });
    
  }

  
  getUserEmailFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }
  
  

  isChatOpen = false;
  
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    
    // Auto-focus input when opening chat
    if (this.isChatOpen) {
      setTimeout(() => {
        const input = document.querySelector('.input-area input');
        if (input) {
          (input as HTMLElement).focus();
        }
      }, 300);
    }
  }
  @ViewChild('messageInput') messageInput!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage = '';
  isLoading = false;
  currentTime = new Date();
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

  constructor(private authService: AuthenticationService,private bookService: BookService,private http: HttpClient, private notificationService: NotificationService,private blogService: BlogService,private userService: UserService,private fb: FormBuilder,private chatbotService: ChatbotService, private router: Router) {}

  ngAfterViewInit() {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }
    firstname = '';
  lastname = '';
  email = '';

  ngOnInit() {
    this.loadGenres();

    this.loadBooks();
    // Auto-focus input when component loads
     this.http.get(`http://localhost:8088/api/v1/image?email=${this.userEmail}`, { responseType: 'blob' })
    .subscribe(blob => {
      this.imageUrl = URL.createObjectURL(blob);
    });
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.userService.getUserByEmail(storedEmail).subscribe({
        next: (user) => {
          this.firstname = user.firstname;
          this.lastname = user.lastname;
          this.email = user.email;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }
    this.localStorageEmail = localStorage.getItem('email');
  this.loadPosts();

   const email = localStorage.getItem('email');
    if (email) {
      this.userEmails = email;
      this.loadNotifications();
      this.loadPurchasedBooks(email);

    }
    

  }
  

  onInputFocus() {
    // Scroll to bottom when input is focused
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage: ChatMessage = {
      text: this.newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    this.messages.push(userMessage);
    
    this.isLoading = true;
    const messageContent = this.newMessage;
    this.newMessage = '';

    // Update status to delivered
    setTimeout(() => {
      userMessage.status = 'delivered';
    }, 500);

    // Get bot response
    this.chatbotService.getChatResponse(messageContent).subscribe({
      next: (response) => {
        userMessage.status = 'read';
        
        this.messages.push({
          text: response.response,
          sender: 'bot',
          timestamp: new Date(),
          lang: response.lang,
          translated: response.translated
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Chatbot error:', error);
        userMessage.status = 'read';
        
        this.messages.push({
          text: "Sorry, I encountered an error. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });

    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messageArea = document.querySelector('.message-area');
      if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
      }
    }, 100);
  }




  fauser=faUser;
    fadoor=faDoorOpen;
    isScrolled=false;
    faset=faGear;
    fabar=faList;
    faedit=faEdit;
    facom=faComment;
    fabarc=faBarcode;
    facalender=faCalendarAlt;
    famarket=faShop;
    fashop=faShoppingCart;
    fainfo=faInfoCircle;
    faclock=faClock;
    faheart=faHeart;
    fabook=faBook;
     @HostListener('window:scroll', [])
       onWindowScroll() {
         this.isScrolled = window.scrollY > 50;
       }
  
      
      
      logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
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
    ////notification
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

 ////books 
  books: BookDTO[] = [];
  showPaymentModal = false;
  selectedBook: BookDTO | null = null;
  purchaseLoading = false;

  
  // In book-list.component.ts


  

  
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

  loading = false;
  filteredBooks: BookDTO[] = [];


  addToWishlist(book: BookDTO): void {
    // Implement wishlist functionality
    console.log('Added to wishlist:', book.title);
    // You might want to add a toast notification here
  }

  openUploadDialog(): void {
    // Implement book upload dialog
    console.log('Open upload dialog');
  }



  // Update your loadBooks method to initialize filteredBooks

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
      this.filteredBooks = [...this.books];
      this.updatePagination();
    },
    error: (err) => {
      console.error('Error loading books', err);
    }
  });
}


  ///payment
  // Add these properties to your component



    purchasedBookIds: number[] = [];


    // Payment Form
    paymentForm = this.fb.group({
  cardNumber: ['', [
    Validators.required,
    // Custom validator to check 16 digits (excluding spaces)
    (control: { value: string; }) => {
      const value = control.value?.replace(/\s/g, '') || ''; // Remove spaces
      if (value && value.length !== 16) {
        return { invalidLength: true }; // Error if not 16 digits
      }
      return null; // Valid
    }
  ]],       expiry: ['', [Validators.required, this.expiryDateValidator()]],
      cvv: [
  '',
  [
    Validators.required,
    Validators.pattern(/^\d{3,4}$/) // only 3 or 4 digits allowed
  ]
]
,
      name: ['', Validators.required]
    });

  // Add these methods
  // In your component (market.component.ts)
  openPaymentModal(book: BookDTO): void {
    this.selectedBook = book;
    this.showPaymentModal = true;
  }

    // Close payment modal
    closePaymentModal(): void {
      this.showPaymentModal = false;
      this.paymentForm.reset();
      this.selectedBook = null;
    }

    // Submit payment
   submitPayment(): void {
  if (this.paymentForm.invalid || !this.selectedBook) {
    this.markFormAsTouched();
    return;
  }

  const userEmail = localStorage.getItem('email');
  if (!userEmail) {
    this.router.navigate(['/login']);
    return;
  }

  this.purchaseLoading = true;

  this.bookService.purchaseBook(this.selectedBook.id!, userEmail).subscribe({
    next: () => {
      // Update local state
      this.purchasedBookIds.push(this.selectedBook!.id!);
      this.selectedBook!.isPurchased = true;
      
      this.purchaseLoading = false;
      Swal.fire({
        title: 'Success!',
        text: 'Book purchased successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.closePaymentModal();
    },
    error: (err) => {
      this.purchaseLoading = false;
      this.handlePurchaseError(err);
    }
  });
}

private handlePurchaseError(err: Error): void {
  let errorMessage = 'Failed to complete purchase';
  
  if (err.message.includes('ALREADY_PURCHASED') || err.message.includes('already owns')) {
    errorMessage = 'You already own this book!';
    if (this.selectedBook) {
      this.purchasedBookIds.push(this.selectedBook.id!);
      this.selectedBook.isPurchased = true;
    }
  } else if (err.message.includes('Book not found')) {
    errorMessage = 'The book could not be found';
  } else if (err.message.includes('User not found')) {
    errorMessage = 'Please login again';
    this.router.navigate(['/login']);
  }

  Swal.fire({
    title: 'Purchase Error',
    text: errorMessage,
    icon: 'error',
    confirmButtonText: 'OK'
  });
}
 
    


    // Helper method to mark all form fields as touched
    private markFormAsTouched(): void {
      Object.values(this.paymentForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // Handle successful purchase
    private handlePurchaseSuccess(): void {
      Swal.fire('Success', 'Book purchased successfully!', 'success');
      this.closePaymentModal();
      if (this.selectedBook) {
        this.selectedBook.isPurchased = true;
      }
      this.purchaseLoading = false;
    }
formatCardNumber(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); // Remove non-digits
  if (value.length > 16) value = value.substring(0, 16);

  // Add spaces every 4 digits
  const formatted = value.replace(/(.{4})/g, '$1 ').trim();
  this.paymentForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
}
formatExpiryDate(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');

  if (value.length > 4) {
    value = value.slice(0, 4);
  }

  if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  this.paymentForm.get('expiry')?.setValue(value, { emitEvent: false });
}
expiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value || !/^\d{2}\/\d{2}$/.test(value)) {
      return { invalidFormat: true };
    }

    const [month, year] = value.split('/').map(Number);
    if (month < 1 || month > 12) {
      return { invalidMonth: true };
    }

    const now = new Date();
    const inputDate = new Date(+`20${year}`, month - 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth());

    if (inputDate < currentMonth) {
      return { expired: true };
    }

    return null;
  };
}
onCvvInput(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, ''); // remove non-digits
  this.paymentForm.get('cvv')?.setValue(input.value);
}



// Selected genres
  genres: Genre[] = [];          // <-- Declare the genres property here
 // Books after filtering
  selectedGenres: string[] = [];

loadGenres() {
  this.bookService.getAllGenres().subscribe({
    next: (data: string[]) => {
      this.genres = data.map((name, index) => ({
        id: index + 1,
        name: name
      }));
    },
    error: (err) => {
      console.error('Error loading genres', err);
    }
  });
}

  

// Your existing code ...

onGenreCheckboxChange(event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  const genreName = checkbox.value;

  if (checkbox.checked) {
    if (!this.selectedGenres.includes(genreName)) {
      this.selectedGenres.push(genreName);
    }
  } else {
    this.selectedGenres = this.selectedGenres.filter(g => g !== genreName);
  }

  this.filterBooksBySelectedGenres();
}

resetGenreFilter(): void {
  this.selectedGenres = [];
  this.filteredBooks = [...this.books];
}

showGenreDropdown = false;

toggleGenreDropdown() {
  this.showGenreDropdown = !this.showGenreDropdown;
}


// Pagination properties
currentPage: number = 1;
itemsPerPage: number = 6;  // Customize how many books per page
totalPages: number = 1;
pages: number[] = [];  // Add this for pagination buttons

get paginatedBooks() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredBooks.slice(start, end);
}

// Call this after filtering or sorting to update totalPages and pages array
updatePagination() {
  this.totalPages = Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages || 1;
  }
  this.createPagesArray();  // <-- Add this
}

createPagesArray() {
  this.pages = [];
  for (let i = 1; i <= this.totalPages; i++) {
    this.pages.push(i);
  }
}

// Call updatePagination inside filterBooksBySelectedGenres and filterBooks and sortBooks methods
filterBooksBySelectedGenres(): void {
  if (this.selectedGenres.length === 0) {
    this.filteredBooks = [...this.books];
  } else {
    this.filteredBooks = this.books.filter(book =>
      book.genres.some(g => this.selectedGenres.includes(g))
    );
  }
  this.currentPage = 1;
  this.updatePagination();
}

filterBooks(event: Event): void {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredBooks = this.books.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm)
  );
  this.currentPage = 1;
  this.updatePagination();
}

sortBooks(event: Event): void {
  const sortValue = (event.target as HTMLSelectElement).value;
  if (sortValue === 'price-low') {
    this.filteredBooks.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-high') {
    this.filteredBooks.sort((a, b) => b.price - a.price);
  }
  this.currentPage = 1;
  this.updatePagination();
}

// Pagination control methods
goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages && this.filteredBooks.length > 0) {
    this.currentPage = page;
  }
}

nextPage(): void {
  if (this.canGoNext()) {
    this.currentPage++;
  }
}

prevPage(): void {
  if (this.canGoPrev()) {
    this.currentPage--;
  }
}
canGoPrev(): boolean {
  return this.currentPage > 1 && this.filteredBooks.length > 0;
}

canGoNext(): boolean {
  return this.currentPage < this.totalPages && this.filteredBooks.length > 0;
}
loadPurchasedBooks(email: string): void {
  this.bookService.getPurchasedBooks(email).subscribe({
    next: (books) => {
      this.purchasedBookIds = books.map(book => book.id!);
      // Update the books list to mark purchased ones
      this.books.forEach(book => {
        book.isPurchased = this.purchasedBookIds.includes(book.id!);
      });
    },
    error: (err) => console.error('Error loading purchased books:', err)
  });
}

// Update your purchase flow
initiatePurchase(book: BookDTO): void {
  const userEmail = localStorage.getItem('email');
  if (!userEmail) {
    this.router.navigate(['/login']);
    return;
  }

  // First check client-side cache
  if (this.purchasedBookIds.includes(book.id!)) {
    this.showAlreadyOwnedAlert(book);
    return;
  }

  // Then verify with server
  this.bookService.checkPurchaseStatus(book.id!, userEmail).subscribe({
    next: (alreadyPurchased) => {
      if (alreadyPurchased) {
        this.purchasedBookIds.push(book.id!);
        book.isPurchased = true;
        this.showAlreadyOwnedAlert(book);
      } else {
        this.openPaymentModal(book);
      }
    },
    error: (err) => {
      console.error('Error checking purchase status:', err);
      // Proceed to payment but server will validate again
      this.openPaymentModal(book);
    }
  });
}

private showAlreadyOwnedAlert(book: BookDTO): void {
  Swal.fire({
    title: 'Already Purchased',
    html: `You already own <strong>${book.title}</strong>!<br>Would you like to read it now?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Read Now',
    cancelButtonText: 'Cancel',
    background: '#f8f9fa',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/my-books']);
    }
  });
}
viewDetails(bookId: number | undefined) {
  if (bookId) {
    this.router.navigate(['/books', bookId]);
  }
}

}
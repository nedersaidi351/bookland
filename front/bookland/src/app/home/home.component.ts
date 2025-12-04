import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { VerificationRequest } from '../models/verification-request';
import { Router } from '@angular/router';
import { AuthenticationService } from '../serives/authentication.service';
import { AuthenticationResponse } from '../models/authentication-response';
import { RegisterRequest } from '../models/register-request';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook} from '@fortawesome/free-solid-svg-icons';
import { ChatbotService } from '../services/chatbot.service';
import { Post } from '../models/Post';
import { BlogService } from '../services/blog.service';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  constructor(private authService: AuthenticationService,private http: HttpClient, private notificationService: NotificationService,private blogService: BlogService,private userService: UserService,private fb: FormBuilder,private chatbotService: ChatbotService, private router: Router) {}

  ngAfterViewInit() {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }
    firstname = '';
  lastname = '';
  email = '';

  ngOnInit() {
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
  setInterval(() => this.loadPosts(), 700); 

   const email = localStorage.getItem('email');
    if (email) {
      this.userEmails = email;
      this.loadNotifications();
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
    facom=faComment;
    famarket=faShop;
    faclock=faClock;
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

 

}

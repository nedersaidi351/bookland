
import { WebsocketService } from '../serives/websocket.service';
import { Component, HostListener } from '@angular/core';
import { VerificationRequest } from '../models/verification-request';
import { Router } from '@angular/router';
import { AuthenticationService } from '../serives/authentication.service';
import { AuthenticationResponse } from '../models/authentication-response';
import { RegisterRequest } from '../models/register-request';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook} from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  
   messages: any[] = [];
    newMessage = '';
    sender = '';
    typingUsers: string[] = [];
  
    private typingSubject = new Subject<string>();
  
    constructor(private chatService: ChatService, private userService: UserService,private router: Router) {}
  
    ngOnInit() {
      const email = localStorage.getItem('email');
      if (email) {
        this.userService.getUserByEmail(email).subscribe((user) => {
          this.sender = `${user.firstname} ${user.lastname}`;
  
          this.chatService.getGroupChatHistory().subscribe((history) => {
            this.messages = history;
          });
  
          this.chatService.messages$.subscribe((msg) => {
            if (msg) this.messages.push(msg);
          });
  
          this.chatService.typing$.subscribe(({ sender, typing }) => {
            if (typing && sender !== this.sender) {
              if (!this.typingUsers.includes(sender)) {
                this.typingUsers.push(sender);
              }
            } else {
              this.typingUsers = this.typingUsers.filter((user) => user !== sender);
            }
          });
        });
      }
  
      this.typingSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
        this.chatService.sendTypingStatus(this.sender, true);
        setTimeout(() => {
          this.chatService.sendTypingStatus(this.sender, false);
        }, 1000);
      });
    }
  
    sendMessage() {
      if (this.newMessage.trim()) {
        const msg = {
          sender: this.sender,
          content: this.newMessage,
          timestamp: new Date().toISOString(),
        };
        this.chatService.sendMessage(msg);
        this.newMessage = '';
      }
    }
  
   typingTimeout: any;
  
  onMessageInput() {
    // Immediately broadcast typing = true
    this.chatService.sendTypingStatus(this.sender, true);
  
    // Clear any previous timer
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  
    // Set a new timer to send typing = false after 1.5s of inactivity
    this.typingTimeout = setTimeout(() => {
      this.chatService.sendTypingStatus(this.sender, false);
    }, 1500);
  }
  
  // Add to your component class
  currentUser = "You"; // Replace with your actual current user logic
  
  getUserColor(username: string): string {
    // Simple hash for consistent colors per user
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const hash = username.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  }
  
  adjustTextareaHeight(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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
      @HostListener('window:scroll', [])
        onWindowScroll() {
          this.isScrolled = window.scrollY > 50;
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

}

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage = '';
  sender = '';
  typingUsers: string[] = [];

  private typingSubject = new Subject<string>();
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
  constructor(private chatService: ChatService, private userService: UserService,private router : Router) {}

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
}

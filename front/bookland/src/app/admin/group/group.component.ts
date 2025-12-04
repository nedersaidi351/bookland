import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBell, faBook, faBox, faCircle, faComments, faCommentSlash, faDoorOpen, faEye, faFilter, faListCheck, faMessage, faNewspaper, faPaperPlane, faSearch, faShieldAlt, faTimes, faTrash, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from 'src/app/services/chat.service';
import Swal from 'sweetalert2';
interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  // Add other message properties as needed
}
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit{
  messages: ChatMessage[] = [];
  filteredMessages: ChatMessage[] = [];
  currentUser = 'Admin'; // Or get from auth service
  searchText = '';
  
  // Font Awesome icons
   fagroup=faComments;
    fapub=faNewspaper;
    faBell = faBell;
    faCircle = faCircle;
    fadoor = faDoorOpen;
    faEye = faEye;
    faPaperPlane = faPaperPlane;
    faSearch = faSearch;
    faTimes = faTimes;
    fauser = faUser;
    famiss=faListCheck;
    fashield=faShieldAlt;
    fabox=faBox;
    fabook=faBook;
    fanot=faBell;
    faTrashAlt=faTrashAlt;
    faTrash=faTrash;
    faMessage=faMessage;
    faFilter=faFilter;
    faCommentSlash=faCommentSlash;
  

  constructor(private chatService: ChatService,private router: Router) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService.getGroupChatHistory().subscribe({
      next: (messages: ChatMessage[]) => {
        this.messages = messages;
        this.filteredMessages = [...messages];
      },
      error: (err: any) => console.error('Error loading messages', err)
    });
  }

  filterMessages(): void {
    if (!this.searchText) {
      this.filteredMessages = [...this.messages];
      return;
    }
    const searchTerm = this.searchText.toLowerCase();
    this.filteredMessages = this.messages.filter(msg =>
      msg.content.toLowerCase().includes(searchTerm) ||
      msg.sender.toLowerCase().includes(searchTerm)
    );
  }

  confirmDelete(messageId: number): void {
    Swal.fire({
      title: 'Delete Message?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chatService.deleteChatMessage(messageId).subscribe({
          next: () => {
            this.messages = this.messages.filter(m => m.id !== messageId);
            this.filterMessages();
            Swal.fire('Deleted!', 'The message has been deleted.', 'success');
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to delete message.', 'error');
          }
        });
      }
    });
  }

  confirmClearAll(): void {
    Swal.fire({
      title: 'Clear All Messages?',
      text: "This will delete the entire chat history!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear all!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chatService.clearChatHistory().subscribe({
          next: () => {
            this.messages = [];
            this.filteredMessages = [];
            Swal.fire('Cleared!', 'All messages have been deleted.', 'success');
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to clear messages.', 'error');
          }
        });
      }
    });
  }

  getUserColor(username: string): string {
    // Your existing color generation logic
    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  }
   logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}

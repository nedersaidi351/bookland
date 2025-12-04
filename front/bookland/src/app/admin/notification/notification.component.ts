import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { faBell, faBook, faBox, faCircle, faComments, faDoorOpen, faEye, faListCheck, faNewspaper, faPaperPlane, faSearch, faShieldAlt, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  // Icons
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

  // Data
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers = new Set<number>();
  content = '';
  isSending = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.loadUserImages();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  loadUserImages(): void {
    this.users.forEach(user => {
      if (user.email) {
        this.userService.getImage(user.email).subscribe({
          next: (imageBlob) => {
            const reader = new FileReader();
            reader.onload = () => {
              user.imageUrl = reader.result as string;
            };
            reader.readAsDataURL(imageBlob);
          },
          error: () => {
            user.imageUrl = 'assets/default-avatar.png';
          }
        });
      }
    });
  }

  filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.firstname.toLowerCase().includes(searchTerm) ||
      user.lastname.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  toggleUserSelection(user: User): void {
    if (this.selectedUsers.has(user.id)) {
      this.selectedUsers.delete(user.id);
    } else {
      this.selectedUsers.add(user.id);
    }
  }

  toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedUsers.clear();
    if (isChecked) {
      this.filteredUsers.forEach(user => this.selectedUsers.add(user.id));
    }
  }

  clearSelection(): void {
    this.selectedUsers.clear();
  }

  async sendBulkNotifications(): Promise<void> {
    if (!this.content || this.selectedUsers.size === 0) return;

    this.isSending = true;
    const emails = Array.from(this.selectedUsers).map(id => {
      const user = this.users.find(u => u.id === id);
      return user?.email || '';
    }).filter(email => email !== '');

    try {
      // Send notifications to each selected user
      const requests = emails.map(email => {
        return this.http.post('http://localhost:8088/api/notifications/send', {
          recipientEmail: email,
          content: this.content
        }).toPromise();
      });

      await Promise.all(requests);
      
      // Show success alert
      await Swal.fire({
        title: 'Success!',
        text: `Notifications sent to ${emails.length} users`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal-confirm-btn'
        }
      });

      // Reset form
      this.content = '';
      this.selectedUsers.clear();
    } catch (err) {
      console.error('Error sending notifications', err);
      
      // Show error alert
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to send some notifications',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal-confirm-btn'
        }
      });
    } finally {
      this.isSending = false;
    }
  }



  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}
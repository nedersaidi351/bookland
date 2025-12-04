import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBell, faBook, faBox, faCircle, faComment, faComments, faDoorOpen, faEdit, faEye, faListCheck, faNewspaper, faShieldAlt, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  
  constructor(private userService: UserService,private router: Router, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadUsers();
 
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        // Load images for each user
        this.users.forEach(user => {
          if (user.email) {
            this.loadUserImage(user);
          }
        });
      },
      error => console.error('Error loading users', error)
    );
  }

  loadUserImage(user: User): void {
    this.userService.getImage(user.email).subscribe(
      imageBlob => {
        const reader = new FileReader();
        reader.onload = () => {
          user.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(imageBlob);
      },
      error => {
        // Image not found or other error - use default avatar
        user.imageUrl = 'assets/default-avatar.png';
      }
    );
  }

  deleteUser(id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete user!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
        },
        error: (error) => {
          console.error('Error deleting user', error);
          Swal.fire(
            'Error!',
            'Failed to delete user.',
            'error'
          );
        }
      });
    }
  });
}


  fauser=faUser;
  fabox=faBox;
  faeyes=faEye;
  faedit=faEdit;
  fatrash=faTrash;
  fabook=faBook;
  fanot=faBell;
  fashield=faShieldAlt;
  famiss=faListCheck;
  facircle=faCircle;
  fagroup=faComments;
  fapub=faNewspaper;
  fadoor=faDoorOpen;
    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      }

  notifications: any[] = [];
  dropdownOpen = false;
    toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  clearNotifications(): void {
    this.notifications = [];
    this.dropdownOpen = false;
  }
      
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPhone, faShieldAlt, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';
import { Post } from 'src/app/models/Post';
import { User } from 'src/app/models/user';
import { UserAchievement } from 'src/app/models/UserAchievement';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
// Make sure you have this model

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user?: User;
  userId!: number;
  posts: Post[] = [];
  achievements: UserAchievement[] = [];

  // FontAwesome Icons
  fauser = faUser;
  fabox = faBox;
  faedit = faEdit;
  faCalendarAlt = faCalendarAlt;
  fatrash = faTrash;
  facircle = faCircle;
  faArrowLeft = faArrowAltCircleLeft;
  faPhone = faPhone;
  faShieldAlt = faShieldAlt;
  fadoor = faDoorOpen;
  fanot=faBell;
  fabook=faBook;
  faenv=faEnvelope;
  fashield=faShieldAlt;
  faTrophy=faTrophy;
  famiss=faListCheck;
  fagroup=faComments;
  fapub=faNewspaper;
  
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUser();
           this.loadBooksCount();

      this.loadAchievements();
    }
  }

  loadUser(): void {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Failed to load user', err);
      }
    });
  }



  loadAchievements(): void {
    this.userService.getUserAchievements(this.userId).subscribe({
      next: (achievements) => {
        this.achievements = achievements;
      },
      error: (err) => {
        console.error('Failed to load achievements', err);
      }
    });
  }

  deleteUser(id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    backdrop: `
      rgba(0,0,0,0.4)
      url("/assets/images/nyan-cat.gif")
      left top
      no-repeat
    `,
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      // Show loading indicator
      Swal.fire({
        title: 'Deleting...',
        html: 'Please wait while we delete the user',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.userService.deleteUser(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: 'User deleted successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/users']);
          });
        },
        error: (err) => {
          console.error('Failed to delete user', err);
          Swal.fire({
            title: 'Error!',
            text: err.error?.message || 'Failed to delete user',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  });
}

  ///
  getTierImage(tierName?: string): string {
  if (!tierName) return 'assets/img/trophies/bronze.png';
  
  tierName = tierName.toLowerCase();
  
  if (tierName.includes('bronze')) return 'assets/img/bronze.png';
  if (tierName.includes('silver')) return 'assets/img/silver-cup.png';
  if (tierName.includes('gold')) return 'assets/img/trophy.png';
  if (tierName.includes('diamond')) return 'assets/img/diamond.png';
  if (tierName.includes('platinum')) return 'assets/img/badge.png';
  
  return 'assets/img/trophies/bronze.png';
}
  
  
  booksCount: number = 0;
   loadBooksCount(): void {
    this.userService.getBooksCount(this.userId).subscribe({
      next: (count) => {
        this.booksCount = count;
      },
      error: (err) => {
        console.error('Failed to load purchased books count', err);
      }
    });
  }

}

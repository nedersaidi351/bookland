import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook, faCamera, faUpload, faThumbTack, faUsers, faTrophy, faNewspaper, faHeart, faIdCard, faFileAlt, faPen, faTrash, faCalendar, faEdit, faArrowRight, faTimes} from '@fortawesome/free-solid-svg-icons';
import { ChatbotService } from '../services/chatbot.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { BlogService } from '../services/blog.service';
import { Post } from '../models/Post';
import Swal from 'sweetalert2';
import { TodoService } from '../services/todo.service';
import { UserAchievement } from '../models/UserAchievement';
interface UserUpdateRequest {
  firstname: string;
  lastname: string;
  password?: string;
  confpassword?: string;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  selectedFile!: File;
  imageUrl: string = '';
  userEmail = localStorage.getItem('email');
   localStorageEmail: string | null = null;
    posts: Post[] = [];
     userPosts: Post[] = []; 
// Add this method to handle image loading errors
handleImageError() {
  this.imageUrl = 'assets/img/avatar.svg';
}
  firstname = '';
  lastname = '';
  email = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      
      // Check if the file is an image
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(this.selectedFile);
    }
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
    
    fathum=faThumbTack;
    facam=faCamera;
    faup=faUpload;
    fauser=faUser;
    faArrowRight=faArrowRight;
    faTimes=faTimes;
    faenv=faEnvelope;
    fausers=faUsers;
    faEdit=faEdit;
      fadoor=faDoorOpen;
      faTrophy=faTrophy;
      faIdCard=faIdCard;
      isScrolled=false;
      faset=faGear;
      faHeart=faHeart;
      faNewspaper=faNewspaper;
      fabar=faList;
      facom=faComment;
      famarket=faShop;
      faCalendar=faCalendar;
      faFileAlt=faFileAlt;
      faTrash=faTrash;
      faPen=faPen;
      faclock=faClock;
      fatrophy=faTrophy;
      fabook=faBook;
       @HostListener('window:scroll', [])
         onWindowScroll() {
           this.isScrolled = window.scrollY > 50;
         }
    
          constructor(
  private http: HttpClient,
  private blogService: BlogService,
  private userService: UserService,
  private fb: FormBuilder,
  private chatbotService: ChatbotService,
  private router: Router,
  private todoService: TodoService // Add this line
) {}
  ngOnInit(): void {
  this.localStorageEmail = localStorage.getItem('email');
  this.loadCurrentUserPosts();
  this.loadPosts();
  this.loadAchievements(); // Add this
  
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
        this.userId = user.id; // capture user ID here

      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
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
  

loadCurrentUserPosts(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.blogService.getPostsByCurrentUser().subscribe({
        next: (posts) => {
          this.userPosts = posts.map(post => {
            post.likedByCurrentUser = (post as any)['likedByEmails']?.includes(email);
            return post;
          });
        },
        error: (error) => {
          console.error('Error loading user posts', error);
          Swal.fire('Error', 'Failed to load your posts.', 'error');
        }
      });
    }
  }
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
 deletePost(post: Post): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.blogService.deletePost(post.id).subscribe({
        next: () => {
          // Remove the post from the userPosts array
          this.userPosts = this.userPosts.filter(p => p.id !== post.id);
          Swal.fire(
            'Deleted!',
            'Your post has been deleted.',
            'success'
          );
        },
        error: (err) => {
          console.error('Error deleting post', err);
          Swal.fire(
            'Error!',
            'Failed to delete the post.',
            'error'
          );
        }
      });
    }
  });
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
/////////////
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
      achievements: UserAchievement[] = [];
completedTasksCount: number = 0;
achievementProgress = {
  currentTier: 'None',
  nextTier: 'Bronze',
  nextMilestone: 3,
  progressPercent: 0
};
// Achievement methods
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

loadAchievements() {
  const email = localStorage.getItem('email');
  if (email) {
    this.todoService.getUserAchievements(email).subscribe({
      next: (achievements) => {
        console.log('Achievements data:', achievements); // Add this line
        this.achievements = achievements;
        this.updateAchievementProgress();
      },
      error: (err) => console.error('Error loading achievements:', err)
    });
  }
}

updateAchievementProgress() {
  const total = this.completedTasksCount;
  
  if (total >= 15) {
    this.achievementProgress = {
      currentTier: 'Platinum',
      nextTier: 'Max Level',
      nextMilestone: 0,
      progressPercent: 100
    };
  }
  else if (total >= 12) {
    this.achievementProgress = {
      currentTier: 'Diamond',
      nextTier: 'Platinum',
      nextMilestone: 15,
      progressPercent: ((total - 12) / 3) * 100
    };
  }
  else if (total >= 9) {
    this.achievementProgress = {
      currentTier: 'Gold',
      nextTier: 'Diamond',
      nextMilestone: 12,
      progressPercent: ((total - 9) / 3) * 100
    };
  }
  else if (total >= 6) {
    this.achievementProgress = {
      currentTier: 'Silver',
      nextTier: 'Gold',
      nextMilestone: 9,
      progressPercent: ((total - 6) / 3) * 100
    };
  }
  else if (total >= 3) {
    this.achievementProgress = {
      currentTier: 'Bronze',
      nextTier: 'Silver',
      nextMilestone: 6,
      progressPercent: ((total - 3) / 3) * 100
    };
  }
  else {
    this.achievementProgress = {
      currentTier: 'None',
      nextTier: 'Bronze',
      nextMilestone: 3,
      progressPercent: (total / 3) * 100
    };
  }
}
  
updateData = {
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: ''
};

showUpdateModal: boolean = false;
userId: number | null = null; // Assuming you'll have this in user data
openUpdateModal() {
  this.updateData = {
    firstname: this.firstname,
    lastname: this.lastname,
    password: '',
    confirmPassword: ''
  };
  this.showUpdateModal = true;
}
closeUpdateModal() {
  this.showUpdateModal = false;
}
updateProfile() {
  if (!this.updateData.firstname || !this.updateData.lastname) {
    alert('First name and last name are required!');
    return;
  }

  if (this.updateData.password) {
    if (this.updateData.password !== this.updateData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (this.updateData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
  }

  if (!this.userId || !this.email) {
    alert('User information is missing!');
    return;
  }

  const updatedUser: User = {
    id: this.userId,
    email: this.email,
    firstname: this.updateData.firstname,
    lastname: this.updateData.lastname,
    password: this.updateData.password || '', // use empty string if not changing password
    confpassword:this.updateData.confirmPassword||''
  };

  this.userService.updateUser(this.userId, updatedUser).subscribe({
    next: (updatedUser) => {
      this.firstname = updatedUser.firstname;
      this.lastname = updatedUser.lastname;
      this.closeUpdateModal();
      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
    error: (err) => {
      console.error('Error updating profile:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update profile: ' + (err.error?.message || err.message),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}


}

import { Component, HostListener, OnInit } from '@angular/core';
import { Todo } from '../models/Todo';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faUser, faDoorOpen, faGear, faList, faComment, faShop, faClock, faBook, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { UserAchievement } from '../models/UserAchievement';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
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
  isSaving: { [key: number]: boolean } = {};
  groupedTodos: Map<string, Todo[]> = new Map();
  todos: Todo[] = [];
  userEmail: string = '';
  achievements: UserAchievement[] = [];
  showAchievementToast = false;
  newAchievement: UserAchievement | null = null;
  
  // Progress tracking
  completedTasksCount: number = 0;
  pendingTasksCount: number = 0;
  achievementProgress = {
    nextMilestone: 3,
    progressPercent: 0,
    currentTier: 'None',
    nextTier: 'Bronze'
  };

  isOpen = false;
  isScrolled = false;
  imageUrl: string = '';
  
  // Font Awesome icons
  fauser = faUser;
  fadoor = faDoorOpen;
  faset = faGear;
  fabar = faList;
  facom = faComment;
  famarket = faShop;
  faclock = faClock;
  fabook = faBook;
  fatrophy = faTrophy;

  constructor(
    private todoService: TodoService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.userEmail = storedEmail;
      this.loadAchievements();
      this.loadTodos();
    } else {
      alert('No user email found in localStorage');
    }
    this.loadProfileImage();
  }

  getGroupColor(groupName: string): string {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];
    const index = Math.abs(this.hashCode(groupName)) % colors.length;
    return colors[index];
  }

  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  getCompletedCount(todos: Todo[]): number {
    return todos.filter(t => t.completed).length;
  }

  loadTodos() {
    this.todoService.getGroupedTodosByEmail(this.userEmail).subscribe({
      next: (groupedTodos) => {
        this.groupedTodos = new Map(Object.entries(groupedTodos));
        const allTodos = Array.from(this.groupedTodos.values()).flat();
        this.completedTasksCount = allTodos.filter(t => t.completed).length;
        this.pendingTasksCount = allTodos.length - this.completedTasksCount;
        this.updateAchievementProgress();
      },
      error: (err) => {
        console.error('Error loading todos:', err);
        this.groupedTodos = new Map();
      }
    });
  }

  loadProfileImage() {
    this.http.get(`http://localhost:8088/api/v1/image?email=${this.userEmail}`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          this.imageUrl = URL.createObjectURL(blob);
        },
        error: () => {
          this.imageUrl = 'assets/img/avatar.svg';
        }
      });
  }

  updateCompletionStatus(todo: Todo) {
    if (todo.completed) {
      alert('This task is already completed and cannot be marked as incomplete.');
      return;
    }

    this.isSaving[todo.id!] = true;

    this.todoService.updateCompletionStatus(
      todo.id!,
      true,
      this.userEmail
    ).subscribe({
      next: (updatedTodo) => {
        todo.completed = updatedTodo.completed;
        this.isSaving[todo.id!] = false;
        this.completedTasksCount += 1;
        this.pendingTasksCount -= 1;
        
        this.updateAchievementProgress();
        
        setTimeout(() => {
          this.checkForNewAchievements();
        }, 300);
      },
      error: (err) => {
        console.error('Error updating completion status:', err);
        this.isSaving[todo.id!] = false;
      }
    });
  }

  private hasCheckedInitialAchievements = false;
  isLoadingAchievements = false;

  checkForNewAchievements() {
    if (this.isLoadingAchievements) return;
    
    this.isLoadingAchievements = true;
    const previousCount = this.achievements.length;

    this.todoService.getUserAchievements(this.userEmail).subscribe({
      next: (achievements) => {
        if (achievements.length !== previousCount) {
          this.achievements = achievements;
          
          if (this.hasCheckedInitialAchievements && achievements.length > previousCount) {
            const newAchievements = achievements.slice(previousCount);
            this.newAchievement = newAchievements[newAchievements.length - 1];
            this.showAchievementToast = true;
            
            setTimeout(() => {
              this.showAchievementToast = false;
            }, 5000);
          }
        }
        
        this.hasCheckedInitialAchievements = true;
        this.isLoadingAchievements = false;
      },
      error: (err) => {
        console.error('Error checking for new achievements:', err);
        this.isLoadingAchievements = false;
      }
    });
  }

  loadAchievements() {
    if (this.achievements.length > 0) return;
    
    this.isLoadingAchievements = true;
    this.todoService.getUserAchievements(this.userEmail).subscribe({
      next: (achievements) => {
        this.achievements = achievements;
        this.isLoadingAchievements = false;
        this.hasCheckedInitialAchievements = true;
      },
      error: (err) => {
        console.error('Error loading achievements:', err);
        this.isLoadingAchievements = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  handleImageError() {
    this.imageUrl = 'assets/img/avatar.svg';
  }

  getTierImage(tierName: string): string {
    if (!tierName) return 'assets/img/trophies/bronze.png';
    
    tierName = tierName.toLowerCase();
    
    if (tierName.includes('bronze')) return 'assets/img/bronze.png';
    if (tierName.includes('silver')) return 'assets/img/silver-cup.png';
    if (tierName.includes('gold')) return 'assets/img/trophy.png';
    if (tierName.includes('diamond')) return 'assets/img/diamond.png';
    if (tierName.includes('platinum')) return 'assets/img/badge.png';
    
    return 'assets/img/trophies/bronze.png';
  }

  updateAchievementProgress() {
    const total = this.completedTasksCount;
    
    // Updated progress tracking for the new achievement tiers
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
}
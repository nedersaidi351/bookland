import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  workTime = 1; // Reduced to 4 minutes for testing
  breakTime = 1;
  seconds = "00";
   imageUrl: string = '';
  handleImageError() {
  this.imageUrl = 'assets/img/avatar.svg';
}
  // Timer state
  workMinutes = this.workTime;
  breakMinutes = this.breakTime;
  breakCount = 0;
  timerInterval: any;
  isRunning = false;
  isPaused = false;
  isWorkActive = true;

  ngOnInit(): void {
    this.resetTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    if (this.isPaused) {
      // Resume from pause
      this.isPaused = false;
      this.isRunning = true;
      this.timerInterval = setInterval(() => this.timerFunction(), 1000);
    } else {
      // Start fresh
      this.isRunning = true;
      this.seconds = "59";
      this.workMinutes = this.workTime - 1;
      this.breakMinutes = this.breakTime - 1;
      this.breakCount = 0;
      this.timerInterval = setInterval(() => this.timerFunction(), 1000);
    }
  }

  pauseTimer(): void {
    this.isRunning = false;
    this.isPaused = true;
    this.stopTimer();
  }

  private timerFunction(): void {
    let secondsNum = parseInt(this.seconds);
    secondsNum--;
    this.seconds = secondsNum < 10 ? `0${secondsNum}` : `${secondsNum}`;

    if(secondsNum === 0) {
      if(this.isWorkActive) {
        this.workMinutes--;
      } else {
        this.breakMinutes--;
      }
      
      if((this.isWorkActive && this.workMinutes === -1) || 
         (!this.isWorkActive && this.breakMinutes === -1)) {
        this.switchPeriod();
      }
      this.seconds = "59";
    }
  }

  private switchPeriod(): void {
    if(this.breakCount % 2 === 0) {
      // Switch to break
      this.isWorkActive = false;
      this.workMinutes = this.breakTime;
    } else {
      // Switch to work
      this.isWorkActive = true;
      this.workMinutes = this.workTime;
    }
    this.breakCount++;
  }

  resetTimer(): void {
    this.stopTimer();
    this.isRunning = false;
    this.isPaused = false;
    this.isWorkActive = true;
    this.workMinutes = this.workTime;
    this.breakMinutes = this.breakTime;
    this.seconds = "00";
    this.breakCount = 0;
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  calculateProgress(): number {
    const totalSeconds = this.isWorkActive ? 
      this.workTime * 60 : 
      this.breakTime * 60;
    const remainingSeconds = (this.isWorkActive ? this.workMinutes : this.breakMinutes) * 60 + parseInt(this.seconds);
    const progress = (remainingSeconds / totalSeconds) * 283; // 283 is circumference
    return progress;
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
  
       constructor(
        private router: Router // Inject Router
      ) { }
      
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

   
}

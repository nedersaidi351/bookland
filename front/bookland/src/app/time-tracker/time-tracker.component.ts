import { Component, HostListener, OnInit } from '@angular/core';
import { TimeTrackerService } from '../services/time-tracker.service';
import Swal from 'sweetalert2';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

interface Notification {
  id: number;
  recipientEmail: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  expanded?: boolean; // Added for UI state
}

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.css']
})
export class TimeTrackerComponent implements OnInit {
  tracking = false;
  logId: number | null = null;
  email = '';
  logs: any[] = [];
  filteredLogs: any[] = [];

  fromDate: string | null = null;
  toDate: string | null = null;

  scheduledStart: string = '';
  scheduledEnd: string = '';
  countdown: string = '';
  
  countdownHours: string = '00';
  countdownMinutes: string = '00';
  countdownSeconds: string = '00';
  countdownProgress: number = 0;
  isCounting: boolean = false;

  private scheduledStartTimeout: any;
  private scheduledEndTimeout: any;
  private isScheduledTracking: boolean = false;
  private countdownInterval: any;
  private totalCountdownDuration: number = 0;

  // ✅ Declare alarmAudio at top level and instantiate later
  private alarmAudio!: HTMLAudioElement;

  constructor(private timeService: TimeTrackerService, private router: Router,private notificationService: NotificationService) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.email = storedEmail;
      this.fetchLogs();
    }

    const storedStart = localStorage.getItem('scheduledStart');
    const storedEnd = localStorage.getItem('scheduledEnd');
    const trackingStarted = localStorage.getItem('trackingStarted');
    const now = Date.now();

    if (storedStart && storedEnd) {
      const startMs = new Date(storedStart).getTime();
      const endMs = new Date(storedEnd).getTime();
      this.scheduledStart = storedStart;
      this.scheduledEnd = storedEnd;

      if (now < startMs) {
        this.startCountdown(endMs, false);
      } else if (now >= startMs && now < endMs) {
        if (trackingStarted !== 'true') {
          this.start();
          localStorage.setItem('trackingStarted', 'true');
        }
        this.startCountdown(endMs, true);
      } else if (now >= endMs) {
        this.clearSchedule();
      }
    }
  }

  start() {
    this.timeService.startTracking(this.email).subscribe((res: any) => {
      this.tracking = true;
      this.logId = res.id;
      localStorage.setItem('trackingStarted', 'true');
      this.fetchLogs();
    });
  }

  stop() {
    if (this.logId) {
      this.timeService.stopTracking(this.logId).subscribe(() => {
        this.tracking = false;
        this.logId = null;
        this.clearCountdown();
        this.clearSchedule();
        this.fetchLogs();
        Swal.fire('Tracking Stopped', 'Scheduled tracking has ended.', 'info');
      });
    }
  }

  fetchLogs() {
    this.timeService.getLogs(this.email).subscribe((res: any) => {
      this.logs = res;
      this.filteredLogs = res;
    });
  }

  applyDateFilter() {
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    this.filteredLogs = this.logs.filter(log => {
      const logDate = new Date(log.startTime);
      if (from && logDate < from) return false;
      if (to && logDate > to) return false;
      return true;
    });
  }

  clearDateFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.filteredLogs = [...this.logs];
  }

  calculateDuration(start: string, end: string | null): string {
    if (!end) return '-';

    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  calculateTotalDuration(): string {
    let totalMs = 0;
    
    for (const log of this.filteredLogs) {
      if (log.endTime) {
        const start = new Date(log.startTime).getTime();
        const end = new Date(log.endTime).getTime();
        totalMs += (end - start);
      }
    }
    
    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
    const hours = Math.floor(totalMs / (1000 * 60 * 60));

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  scheduleTracking() {
    const start = new Date(this.scheduledStart).getTime();
    const end = new Date(this.scheduledEnd).getTime();
    const now = Date.now();

    if (!start || !end || end <= start || start <= now) {
      Swal.fire('Invalid Time', 'Make sure start and end times are in the future and valid.', 'error');
      return;
    }

    Swal.fire('Tracking Scheduled', 'Tracking will start and stop automatically.', 'success');

    // ✅ Initialize audio after user action
    this.alarmAudio = new Audio('assets/sounds/alarm1.mp3');
    this.alarmAudio.load();

    localStorage.setItem('scheduledStart', this.scheduledStart);
    localStorage.setItem('scheduledEnd', this.scheduledEnd);
    localStorage.setItem('trackingStarted', 'false');

    const delayToStart = start - now;
    const delayToEnd = end - now;

    setTimeout(() => {
      if (localStorage.getItem('trackingStarted') !== 'true') {
        this.start();
        localStorage.setItem('trackingStarted', 'true');
      }
    }, delayToStart);

    setTimeout(() => {
      this.stop();
      this.alarmAudio.play(); // 🔊 Play here after user interaction and audio is loaded
    }, delayToEnd);

    this.startCountdown(end, false);
  }

  startCountdown(endMs: number, isRunning: boolean) {
    this.clearCountdown();
    const now = Date.now();
    this.totalCountdownDuration = endMs - now;
    this.isCounting = true;

    this.countdownInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endMs - now;

      if (remaining <= 0) {
        this.countdownHours = '00';
        this.countdownMinutes = '00';
        this.countdownSeconds = '00';
        this.countdownProgress = 100;
        this.countdown = '0h 0m 0s';
        this.isCounting = false;
        this.clearCountdown();

        // 🔊 Play alarm when countdown ends
        if (this.alarmAudio) this.alarmAudio.play();

        if (isRunning) this.stop();
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      this.countdownHours = hours.toString().padStart(2, '0');
      this.countdownMinutes = minutes.toString().padStart(2, '0');
      this.countdownSeconds = seconds.toString().padStart(2, '0');
      this.countdownProgress = ((this.totalCountdownDuration - remaining) / this.totalCountdownDuration) * 100;
      this.countdown = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdown = '';
    this.countdownHours = '00';
    this.countdownMinutes = '00';
    this.countdownSeconds = '00';
    this.countdownProgress = 0;
    this.isCounting = false;
  }

  clearSchedule() {
    localStorage.removeItem('scheduledStart');
    localStorage.removeItem('scheduledEnd');
    localStorage.removeItem('trackingStarted');
    this.scheduledStart = '';
    this.scheduledEnd = '';
    this.clearCountdown();
  }

  // ✅ Button to test alarm manually
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
           showNotifications = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  errorMessage = '';
    userEmails = '';
      isLoading = false;

  
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
  navigateToStopwatch() {
      this.router.navigate(['/timer']);
    }
      imageUrl: string = '';


      handleImageError() {
  this.imageUrl = 'assets/img/avatar.svg';
}
}

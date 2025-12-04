import { Component, HostListener } from '@angular/core';
import { VerificationRequest } from '../models/verification-request';
import { Router } from '@angular/router';
import { AuthenticationService } from '../serives/authentication.service';
import { AuthenticationResponse } from '../models/authentication-response';
import { RegisterRequest } from '../models/register-request';
import{faUser,faLock,faGlobe, faDoorOpen, faGear, faBarsProgress, faList, faComment, faShop, faClock, faBook} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
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

  navigateToStopwatch() {
    this.router.navigate(['/timer']);
  }
}

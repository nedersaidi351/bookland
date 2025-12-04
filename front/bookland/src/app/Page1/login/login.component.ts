import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationRequest } from 'src/app/models/authentication-request';
import { AuthenticationResponse } from 'src/app/models/authentication-response';
import { VerificationRequest } from 'src/app/models/verification-request';
import { AuthenticationService } from 'src/app/serives/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  fauser = faUser;
  falock = faLock;
  faenvelope = faEnvelope;
  isScrolled = false;
  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  submitted = false;
  errorMessage = '';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showWelcomeMessage(): void {
    Swal.fire({
      title: 'Welcome!',
      text: 'You have successfully logged in.',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 1000,
      timerProgressBar: true,
     
    });
  }

  authenticate() {
    this.submitted = true;
    
    // Basic validation check
    if (!this.authRequest.email || !this.authRequest.password) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (!this.isValidEmail(this.authRequest.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }
    if (this.authRequest.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          this.authResponse = response;
          if (!this.authResponse.mfaEnabled) {
            localStorage.setItem('token', response.accessToken as string);
            localStorage.setItem('email', this.authRequest.email!);

            this.showWelcomeMessage();
        const email = this.authRequest.email;
          const adminEmails = ['admin@gmail.com']; 

        if (email && adminEmails.includes(email)) {
           this.router.navigate(['users']);
        } else {
          this.router.navigate(['home']);
        }

          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = 'Invalid Email or Password!';
          }
          Swal.fire({
            title: 'Error!',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }

  verifyCode() {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    const verifyRequest: VerificationRequest = {
      email: this.authRequest.email,
      code: this.otpCode
    };
    
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken as string);
          localStorage.setItem('email', this.authRequest.email!);
          this.showWelcomeMessage();
          this.router.navigate(['home']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = 'Invalid verification code. Please try again.';
          } else {
            this.errorMessage = 'Verification failed. Please try again.';
          }
          Swal.fire({
            title: 'Error!',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }
}
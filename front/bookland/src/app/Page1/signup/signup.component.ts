import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRequest } from "../../models/register-request";
import { AuthenticationResponse } from "../../models/authentication-response";
import { AuthenticationService } from "../../serives/authentication.service";
import { VerificationRequest } from "../../models/verification-request";
import { faUser, faLock, faKey, faEnvelope, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fauser = faUser;
  falock = faLock;
  fakey = faKey;
  faenvelope = faEnvelope;
  fauserg = faUserGroup;
  
  isScrolled = false;
  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  otpCode = '';
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

  registerUser() {
    this.submitted = true;
    this.errorMessage = '';
    
    // Basic validation
    if (!this.registerRequest.firstname || 
        !this.registerRequest.lastname || 
        !this.registerRequest.email || 
        !this.registerRequest.password ||
        !this.registerRequest.confpassword) {
          
      this.errorMessage = 'Please fill all required fields';
      Swal.fire({
        title: 'Error!',
        text: this.errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
      return;
    }

    // Email format validation
    if (!this.isValidEmail(this.registerRequest.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Password length validation
    if (this.registerRequest.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    // Password match validation
    if (this.registerRequest.password !== this.registerRequest.confpassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.registerRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            this.authResponse = response;
          } else {
            Swal.fire({
              title: 'Success!',
              text: 'Account created successfully',
              icon: 'success',
              timer: 1200,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['login']);
            });
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = err.error?.message || 'Registration failed';
          } else if (err.status === 409) {
            this.errorMessage = 'Email already exists';
          } else if (err.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = 'Registration failed. Email already exists.';
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

  verifyTfa() {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    const verifyRequest: VerificationRequest = {
      email: this.registerRequest.email,
      code: this.otpCode
    };
  
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Account created successfully',
            icon: 'success',
            timer: 1200,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['login']);
          });
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = 'Invalid verification code. Please try again.';
          } else {
            this.errorMessage = 'Verification failed. Please try again.';
          }
          
          
        }
      });
  }
}
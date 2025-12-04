// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private adminEmails = [
    'admin@gmail.com',
    // Add other admin emails here
  ];

  constructor(private router: Router) {}

  canActivate(): boolean {
    const email = localStorage.getItem('email');
    
    // Check if email exists and is in admin list
    const isAdmin = email && this.adminEmails.includes(email);
    
    if (!isAdmin) {
      this.router.navigate(['/home']); // or your home page
      return false;
    }
    
    return true;
  }
}
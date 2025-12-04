import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const adminEmails = ['admin@gmail.com']; // Add more if needed

  if (!token) {
    router.navigate(['login']);
    return false;
  }

  if (email && adminEmails.includes(email)) {
    router.navigate(['users']);
    return false;
  }

  return true;
};

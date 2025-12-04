import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, Observable, throwError } from 'rxjs';
import { Post } from '../models/Post';
import { UserAchievement } from '../models/UserAchievement';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8088/api/v1'; // Adjust if needed

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string) {
    return this.http.get<any>(`${this.apiUrl}/by-email?email=${encodeURIComponent(email)}`);
  }
  uploadProfileImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
    getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get user by ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

 


  // Create user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update user
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Upload user image
  uploadImage(email: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', image);
    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }

  // Get user image
  getImage(email: string): Observable<Blob> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}/image`, { 
      params, 
      responseType: 'blob' 
    });
  }
  //post et ach
   getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/${userId}/posts`).pipe(
      catchError(error => {
        console.error('Error loading posts:', error);
        return throwError(() => new Error('Failed to load posts'));
      })
    );
  }

   getUserAchievements(userId: number): Observable<UserAchievement[]> {
  return this.http.get<UserAchievement[]>(`${this.apiUrl}/${userId}/achievements`);
}
    getBooksCount(userId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8088/api/purchases/count?userId=${userId}`);
  }
}

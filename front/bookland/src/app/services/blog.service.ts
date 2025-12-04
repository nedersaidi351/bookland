import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Post } from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://localhost:8088/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error:', error);
        let errorMessage = 'An error occurred';
        
        if (error.status === 500) {
          errorMessage = 'Server error: ' + 
            (typeof error.error === 'string' ? error.error : 
             error.error?.message || 'Unknown server error');
        }
        
        return throwError(errorMessage);
      })
    );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(post: {  content: string, user: { email: string } }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }
  likePost(postId: number, email: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/like?email=${email}`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError('You already liked this post.');
        }
        return throwError('Error liking post.');
      })
    );
  }
  
  
  getLikedPostsByUser(email: string): Observable<number[]> {
    return this.http.get<number[]>(`http://localhost:8088/api/posts/liked?email=${email}`);
  }
  
  
getPostsByCurrentUser(): Observable<Post[]> {
  const email = localStorage.getItem('email');
  return this.http.get<Post[]>(`${this.apiUrl}/user`, {
    params: { email: email || '' }
  });
}
deletePost(postId: number): Observable<void> {
  return this.http.delete<void>(
    `http://localhost:8088/api/posts/posts/${postId}`,
    {
      observe: 'response' // Get full response
    }
  ).pipe(
    map(response => {
      if (response.status === 204) {
        return; // Success case
      }
      throw new Error('Unexpected response status');
    }),
    catchError(error => {
      console.error('Delete error:', error);
      return throwError(() => new Error('Delete failed'));
    })
  );
}
  
}

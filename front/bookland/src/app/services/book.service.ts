import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap, map, of, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


import { environment } from '../environment';
import { BookDTO } from '../models/BookDTO ';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Updated createBook with genre support
  createBook(bookDto: BookDTO, coverImage: File, pdfFile: File): Observable<BookDTO> {
    const formData = new FormData();
    
    const bookBlob = new Blob([JSON.stringify(bookDto)], {
      type: 'application/json'
    });
    formData.append('book', bookBlob);
    
    formData.append('coverImage', coverImage, coverImage.name);
    formData.append('pdfFile', pdfFile, pdfFile.name);

    return this.http.post<BookDTO>(`${this.apiUrl}/books`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Get all books with optional genre filter
  getAllBooks(genre?: string): Observable<BookDTO[]> {
    const url = genre ? `${this.apiUrl}/books/genre/${genre}` : `${this.apiUrl}/books`;
    return this.http.get<BookDTO[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Get all available genres
getAllGenres(): Observable<string[]> {
  return this.http.get<string[]>('http://localhost:8088/api/books/genres').pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error fetching genres:', error);
      throw new Error(`Failed to load genres: ${error.status} - ${error.statusText}`);
    })
  );
}


  getBookById(id: number): Observable<BookDTO> {
    return this.http.get<BookDTO>(`${this.apiUrl}/books/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getFileUrl(filename: string | undefined): string {
    if (!filename) return '';
    const cleanFilename = filename.replace(/^\/?api\/files\//, '');
    const encodedFilename = encodeURIComponent(cleanFilename);
    return `${this.apiUrl}/files/${encodedFilename}`;
  }

  getCoverImageUrl(bookId: number): string {
    return `${this.apiUrl}/books/${bookId}/cover`;
  }

// Add this method to check if book is already purchased
// Add this method to check purchase status via API
checkPurchaseStatus(bookId: number, email: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/purchases/check`, {
    params: { email, bookId: bookId.toString() }
  });
}

// Update purchaseBook method
purchaseBook(bookId: number, userEmail: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/purchases`, {
    bookId,
    userEmail
  }).pipe(
    catchError(this.handleError)
  );
}

getPurchasedBooks(email: string): Observable<BookDTO[]> {
  return this.http.get<BookDTO[]>(`${this.apiUrl}/purchases/user`, {
    params: { email },
    observe: 'response'
  }).pipe(
    map(response => {
      if (!response.body) {
        throw new Error('No data received');
      }
      return response.body;
    }),
    catchError(error => {
      if (error.status === 404) {
        return of([]); // Return empty array if no purchases found
      }
      throw error;
    })
  );
}
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      if (error.error?.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
   addGenre(name: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/books/addgenre`, { name }, { responseType: 'text' });
  }
deleteBook(bookId: number) {
  return this.http.delete(`${this.apiUrl}/books/${bookId}`);
}


updateBook(id: number, book: BookDTO): Observable<BookDTO> {
  return this.http.put<BookDTO>(`${this.apiUrl}/books/${id}`, book);
}

}
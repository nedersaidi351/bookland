// chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

interface ChatResponse {
  response: string;
  lang: string;
  translated?: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private flaskApiUrl = 'http://localhost:5005'; // Your Flask API URL

  constructor(private http: HttpClient) { }

  getChatResponse(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.flaskApiUrl}/chat`, { message })
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of({
            response: "Sorry, I'm having trouble connecting to the server.",
            lang: 'en',
            error: 'Connection failed'
          });
        })
      );
  }
}
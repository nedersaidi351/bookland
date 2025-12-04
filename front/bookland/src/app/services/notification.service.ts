import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NotificationRequest } from '../models/NotificationRequest ';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  recipientEmail: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
   private apiUrl = 'http://localhost:8088/api/notifications';

  constructor(private http: HttpClient) { }

  sendNotification(emails: string[], notificationMessage: string, request: NotificationRequest) {
    return this.http.post(`${this.apiUrl}/send`, request);
  }

 getUnreadNotifications(email: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread/${email}`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-read/${id}`, null);
  }
}

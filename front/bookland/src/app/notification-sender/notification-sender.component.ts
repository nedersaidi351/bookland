import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-sender',
  templateUrl: './notification-sender.component.html',
  styleUrls: ['./notification-sender.component.css']
})
export class NotificationSenderComponent {
  recipientEmail = '';
  content = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  sendNotification() {
    const payload = {
      recipientEmail: this.recipientEmail,
      content: this.content
    };

    this.http.post('http://localhost:8088/api/notifications/send', payload)
      .subscribe({
        next: () => {
          this.successMessage = 'Notification sent successfully!';
          this.recipientEmail = '';
          this.content = '';
        },
        error: (err) => {
          console.error(err);
          this.successMessage = 'Failed to send notification.';
        }
      });
  }
}

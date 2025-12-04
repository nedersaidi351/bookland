export interface Notification {
  id: number;
  recipientEmail: string;
  content: string;
  isRead: boolean;  // Changed from 'read'
  createdAt: string;
}
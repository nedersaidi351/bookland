import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient!: Client;
  public messages$ = new BehaviorSubject<any>(null);
  public typing$ = new Subject<{ sender: string; typing: boolean }>();

  private apiUrl = 'http://localhost:8088/api/chat';

  constructor(private http: HttpClient) {
    this.connect();
  }

  connect() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8088/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      // Subscribe to public group messages
      this.stompClient.subscribe('/topic/public', (message: IMessage) => {
        this.messages$.next(JSON.parse(message.body));
      });

      // Subscribe to typing status
      this.stompClient.subscribe('/topic/typing', (message: IMessage) => {
        const status = JSON.parse(message.body);
        this.typing$.next(status);
      });
    };

    this.stompClient.activate();
  }

  sendMessage(msg: any) {
    if (this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(msg),
      });
    }
  }

  getGroupChatHistory() {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }

  sendTypingStatus(sender: string, isTyping: boolean) {
  if (this.stompClient.connected) {
    const status = { sender, typing: isTyping };
    this.stompClient.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify(status),
    });
  }
}
deleteChatMessage(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/message/${id}`);
}

clearChatHistory(): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/clear`);
}

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

 private apiUrl = 'http://localhost:8088/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User) {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

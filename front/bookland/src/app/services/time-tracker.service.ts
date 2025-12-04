import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  private apiUrl = 'http://localhost:8088/api/timelog';

  constructor(private http: HttpClient) {}

  startTracking(email: string) {
    return this.http.post(`${this.apiUrl}/start?email=${email}`, {});
  }

  stopTracking(id: number) {
    return this.http.post(`${this.apiUrl}/stop/${id}`, {});
  }

 getLogs(email: string, from?: string, to?: string): Observable<any> {
  let params = new HttpParams().set('email', email);
  if (from && to) {
    params = params.set('from', from).set('to', to);
  }

  return this.http.get(`${this.apiUrl}/logs`, { params });
}

}

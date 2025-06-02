import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://34.148.109.190/be/api/auth';

  constructor(private http: HttpClient) {}

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload: ChangePasswordRequest = { oldPassword, newPassword };
    return this.http.put(`${this.baseUrl}/change-password`, payload);
  }

  logout() {
    return this.http.post('http://34.148.109.190/be/api/auth/logout', {});
  }
}
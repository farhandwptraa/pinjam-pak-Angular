import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserResponse {
  user_id: string;
  username: string;
  email: string;
  nama_lengkap: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://34.148.109.190/be/api/users'; // ganti kalau beda port

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }
}
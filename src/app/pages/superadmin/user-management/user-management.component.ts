import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';

interface UserResponseDTO {
  user_id: string;
  username: string;
  email: string;
  nama_lengkap: string;
  role: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableModule],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  private http = inject(HttpClient);

  users: UserResponseDTO[] = []; // untuk table manual
  rows: UserResponseDTO[] = [];  // untuk ng-datatable
  cols = [
    { title: 'Username', field: 'username' },
    { title: 'Email', field: 'email' },
    { title: 'Nama Lengkap', field: 'nama_lengkap' },
    { title: 'Role', field: 'role' },
  ];  

  loading = false;

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<UserResponseDTO[]>('http://localhost:8080/api/users', { headers })
      .subscribe({
        next: (data) => {
          this.users = data;
          this.rows = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Gagal ambil data user:', err);
          this.loading = false;
        }
      });
  }
}
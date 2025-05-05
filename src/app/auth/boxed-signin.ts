import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boxed-signin',
  templateUrl: './boxed-signin.html'
})
export class BoxedSigninComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required], // email atau username
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) return;
  
    const body = {
      usernameOrEmail: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password,
    };
  
    this.http.post<any>('http://localhost:8080/api/auth/login', body).subscribe({
      next: (res) => {
        if (res.role_id === 'a5776c6b-74ef-40c7-90bf-628aed81ae92') {
          alert('Akses ditolak. Hanya role tertentu yang bisa login ke dashboard.');
          return;
        }
  
        // Simpan token, role_id, username, dan role di localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('role_id', res.role_id); // Simpan role_id
        localStorage.setItem('username', res.username); // Simpan username
        localStorage.setItem('role', res.role); // Simpan role (misalnya "ADMIN", "USER", dll)
  
        this.router.navigate(['/analytics']); // atau dashboard
      },
      error: (err) => {
        alert('Login gagal: ' + (err.error?.message || 'Periksa kembali data login'));
      },
    });
  }    
}
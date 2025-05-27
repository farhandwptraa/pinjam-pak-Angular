import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']   // perbaikan: styleUrls
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password:         ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const body = this.loginForm.value;
    this.http.post<any>('http://localhost:8080/api/auth/login', body).subscribe({
      next: (res) => {
        if (res.role_id === 'a5776c6b-74ef-40c7-90bf-628aed81ae92') {
          alert('Akses ditolak. Hanya role tertentu yang bisa login ke dashboard.');
          return;
        }

        localStorage.setItem('token',    res.token);
        localStorage.setItem('role_id',  res.role_id);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role',     res.role);
        localStorage.setItem('employeeId', res.employeeId);

        this.router.navigate(['/analytics']);
      },
      error: (err) => {
        alert('Login gagal: ' + (err.error?.message || 'Periksa kembali data login'));
      }
    });
  }
}
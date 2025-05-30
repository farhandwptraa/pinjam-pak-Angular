import { Component, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { SharedModule } from 'src/shared.module';
import { EmployeeResponseDTO } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/service/employee.service';
import { Branch } from 'src/app/models/branch.model';
import { AuthService } from 'src/app/service/auth.service';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-akun',
  standalone: true,
  imports: [SharedModule, NgxCustomModalComponent],
  templateUrl: './profil-akun.component.html',
  animations: [toggleAnimation],
  styleUrls: ['./profil-akun.component.css']  // Perbaikan typo: styleUrls
})
export class ProfilAkunComponent implements OnInit {
  employee: EmployeeResponseDTO | null = null;
  branch: Branch | null = null;

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  modalChangePassword: NgxCustomModalComponent | null = null;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (data) => (this.employee = data),
        error: (err) => console.error('Gagal mengambil data employee:', err),
      });

      this.employeeService.getMyBranch().subscribe({
        next: (data) => (this.branch = data),
        error: (err) => console.error('Gagal mengambil data cabang:', err),
      });
    } else {
      console.error('employeeId tidak ditemukan di localStorage');
    }
  }

  openChangePasswordModal(modal: NgxCustomModalComponent) {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.modalChangePassword = modal;
    modal.open();
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert('Semua field harus diisi!');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        alert('Password berhasil diubah!');
        if (this.modalChangePassword) {
          this.modalChangePassword.close();
        }
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        alert('Gagal mengubah password: ' + (err.error?.message || err.statusText));
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Logout gagal: ' + (err.error?.message || err.statusText));
      }
    });
  }
}
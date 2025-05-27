import { Component, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { SharedModule } from 'src/shared.module';
import { EmployeeResponseDTO } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/service/employee.service';
import { Branch } from 'src/app/models/branch.model';


@Component({
  selector: 'app-profil-akun',
  standalone: true,
  imports: [ SharedModule],
  templateUrl: './profil-akun.component.html',
  animations: [toggleAnimation],
  styleUrl: './profil-akun.component.css'
})
export class ProfilAkunComponent implements OnInit {
  employee: EmployeeResponseDTO | null = null;
  branch: Branch | null = null;

  constructor(private employeeService: EmployeeService) {}

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
}
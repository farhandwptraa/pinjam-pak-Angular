import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { EmployeeResponseDTO, Branch, Role } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableModule, NgxCustomModalComponent],
  templateUrl: './employee-management.component.html',
})
export class EmployeeManagementComponent implements OnInit {
  private http = inject(HttpClient);

  employees: EmployeeResponseDTO[] = [];
  rows: EmployeeResponseDTO[] = [];
  branches: Branch[] = [];
  roles: Role[] = [];
  loading = false;

  selectedEmployee: EmployeeResponseDTO | null = null;
  selectedBranchId = '';
  selectedRole = '';

  readonly cols = [
    { title: 'NIP', field: 'nip' },
    { title: 'Nama Lengkap', field: 'nama_lengkap' },
    { title: 'Username', field: 'username' },
    { title: 'Email', field: 'email' },
    { title: 'Cabang', field: 'namaCabang' },
    { title: 'Role', field: 'role' },
    { title: 'Actions', field: 'actions' }
  ];

  ngOnInit(): void {
    this.fetchInitialData();
  }

  private fetchInitialData(): void {
    this.fetchEmployees();
    this.fetchBranches();
    this.fetchRoles();
  }

  fetchEmployees(): void {
    this.loading = true;
    const headers = this.getAuthHeaders();

    this.http.get<EmployeeResponseDTO[]>('http://34.148.109.190/be/api/employee', { headers })
      .subscribe({
        next: (data) => {
          this.employees = this.rows = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Gagal ambil data employee:', err);
          this.loading = false;
        }
      });
  }

  fetchBranches(): void {
    const headers = this.getAuthHeaders();

    this.http.get<any[]>('http://34.148.109.190/be/api/employee/branches', { headers })
      .subscribe({
        next: (data) => {
          this.branches = data.map(b => ({
            id: b.branchId,
            namaCabang: b.namaCabang
          }));
        },
        error: (err) => console.error('Gagal ambil data cabang:', err)
      });
  }

  fetchRoles(): void {
    const headers = this.getAuthHeaders();

    this.http.get<any[]>('http://34.148.109.190/be/api/employee/roles', { headers })
      .subscribe({
        next: (data) => {
          this.roles = data.map(r => ({
            id: r.roleId,
            nama: r.namaRole
          }));
        },
        error: (err) => console.error('Gagal ambil data role:', err)
      });
  }

  openEditModal(employee: EmployeeResponseDTO, modal: any): void {
    this.selectedEmployee = employee;

    this.selectedBranchId = this.branches.find(b => b.namaCabang === employee.namaCabang)?.id || '';
    this.selectedRole = this.roles.find(r => r.nama === employee.role)?.nama || '';

    modal.open();
  }

  saveEmployeeUpdate(modal: any): void {
    if (!this.selectedEmployee) return;

    const headers = this.getAuthHeaders();
    const selectedBranch = this.branches.find(b => b.id === this.selectedBranchId);

    if (!selectedBranch) {
      console.error('Cabang tidak ditemukan.');
      return;
    }

    const payload = {
      branchName: selectedBranch.namaCabang,
      roleName: this.selectedRole
    };

    this.http.put(`http://34.148.109.190/be/api/employee/${this.selectedEmployee.employeeId}`, payload, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.fetchEmployees();
        modal.close();
        this.resetModalState();
      },
      error: (err) => console.error('Gagal update pegawai:', err)
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private resetModalState(): void {
    this.selectedEmployee = null;
    this.selectedBranchId = '';
    this.selectedRole = '';
  }

  // Tambahan properti untuk form tambah pegawai
  newEmployee = {
    username: '',
    password: '',
    email: '',
    namaLengkap: '',
    nip: '',
    branchId: '',
    roleId: ''
  };

  // Buka modal tambah pegawai
  openAddModal(modal: any): void {
    this.resetNewEmployeeForm();
    modal.open();
  }

  // Simpan pegawai baru
  saveNewEmployee(modal: any): void {
    const headers = this.getAuthHeaders();

    this.http.post('http://34.148.109.190/be/api/employee/register', this.newEmployee, { headers, responseType: 'text' })
      .subscribe({
        next: () => {
          this.fetchEmployees();
          modal.close();
          this.resetNewEmployeeForm();
        },
        error: (err) => console.error('Gagal tambah pegawai:', err)
      });
  }

  // Reset form inputan tambah pegawai
  private resetNewEmployeeForm(): void {
    this.newEmployee = {
      username: '',
      password: '',
      email: '',
      namaLengkap: '',
      nip: '',
      branchId: '',
      roleId: ''
    };
  }
}
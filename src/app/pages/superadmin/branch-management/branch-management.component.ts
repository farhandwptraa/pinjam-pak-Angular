import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { EmployeeService } from 'src/app/service/employee.service';
import { BranchService } from 'src/app/service/branch.service';
import { Branch, Province } from 'src/app/models/branch.model';


@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgxCustomModalComponent
  ],
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.css']
})
export class BranchManagementComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private branchService = inject(BranchService);

  branches: Branch[] = [];
  rows: Branch[] = [];
  cols = [
    { title: 'Nama Cabang', field: 'namaCabang' },
    { title: 'Alamat', field: 'alamat' },
    { title: 'Aksi', field: 'aksi' }
  ];

  // untuk modal provinsi
  provinces: { id: number; name: string }[] = [];
  selectedProvinceIds: number[] = [];
  selectedBranch: Branch | null = null;
  currentModal: NgxCustomModalComponent | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;
    this.employeeService.getBranches().subscribe({
      next: data => {
        this.branches = data;
        this.rows = data;
        this.loading = false;
      },
      error: err => {
        console.error('Gagal mengambil data cabang:', err);
        this.loading = false;
      }
    });
  }

  openProvinceModal(branch: Branch, modal: NgxCustomModalComponent): void {
    this.selectedBranch = branch;
    this.selectedProvinceIds = [];
    this.provinces = [];
    this.currentModal = modal;  // simpan modal sekarang

    this.branchService.getAllProvinces().subscribe({
      next: provs => {
        this.provinces = provs;

        this.branchService.getProvincesByBranch(branch.branchId).subscribe({
          next: assigned => {
            this.selectedProvinceIds = assigned.map(p => p.id);
            modal.open();
          },
          error: () => alert('Gagal mengambil provinsi cabang.')
        });
      },
      error: () => alert('Gagal mengambil daftar provinsi.')
    });
  }

  toggleProvince(id: number): void {
    const idx = this.selectedProvinceIds.indexOf(id);
    if (idx > -1) this.selectedProvinceIds.splice(idx, 1);
    else this.selectedProvinceIds.push(id);
  }

  saveProvinces(): void {
    if (!this.selectedBranch) return;
    this.branchService
      .updateProvincesByBranch(this.selectedBranch.branchId, this.selectedProvinceIds)
      .subscribe({
        next: () => {
          alert('Daftar provinsi berhasil diperbarui!');
          this.closeModal();  // panggil method closeModal() di sini
        },
        error: () => alert('Gagal menyimpan daftar provinsi.')
      });
  }

  closeModal(): void {
    this.currentModal?.close();
    this.selectedBranch = null;
    this.selectedProvinceIds = [];
    this.currentModal = null;
  }
}
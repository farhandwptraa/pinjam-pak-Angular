import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { RoleFeatureService } from 'src/app/service/role-feature.service';
import { Role, Feature, RoleFeatureDTO } from 'src/app/models/role-feature.model';
import { NgxCustomModalComponent } from 'ngx-custom-modal';


@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableModule, NgxCustomModalComponent],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  private roleService = inject(RoleFeatureService);

  roles: Role[] = [];
  features: Feature[] = [];
  selectedFeatureIds: number[] = [];

  selectedRole: Role | null = null;
  showModal = false;
  loading = false;

  rows: Role[] = [];
  cols = [
    { title: 'Role ID', field: 'roleId' },
    { title: 'Nama Role', field: 'namaRole' },
    { title: 'Aksi', field: 'aksi' }
  ];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.rows = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal mengambil data role:', err);
        this.loading = false;
      }
    });
  }

  openFeatureModal(role: Role | null, modal: NgxCustomModalComponent): void {
    if (!role || !role.roleId) {
      console.error('Role tidak ditemukan atau ID kosong:', role);
      alert('Role tidak valid. Tidak dapat membuka modal.');
      return;
    }
  
    this.selectedRole = role;
    this.selectedFeatureIds = [];
    this.features = [];
  
    this.roleService.getAllFeatures().subscribe({
      next: (features) => {
        this.features = features;
  
        this.roleService.getFeaturesByRole(role.roleId).subscribe({
          next: (assignedFeatures) => {
            this.selectedFeatureIds = assignedFeatures.map(f => f.featureId);
  
            // ✅ Modal dibuka secara eksplisit
            modal.open();
            console.log('Modal dibuka untuk:', this.selectedRole?.namaRole);
          },
          error: (err) => {
            console.error('Gagal mengambil fitur role:', err);
            alert('Gagal mengambil fitur untuk role ini.');
          }
        });
      },
      error: (err) => {
        console.error('Gagal mengambil semua fitur:', err);
        alert('Gagal mengambil daftar fitur.');
      }
    });
  }  

  toggleFeature(featureId: number): void {
    const index = this.selectedFeatureIds.indexOf(featureId);
    if (index > -1) {
      this.selectedFeatureIds.splice(index, 1);
    } else {
      this.selectedFeatureIds.push(featureId);
    }
  }

  saveFeatures(): void {
    if (!this.selectedRole) return;

    const dto: RoleFeatureDTO = {
      roleId: this.selectedRole.roleId,
      featureIds: this.selectedFeatureIds
    };

    this.roleService.assignFeaturesToRole(dto).subscribe({
      next: () => {
        alert('Fitur berhasil disimpan!');
        this.closeModal();
      },
      error: (err) => {
        console.error('Gagal menyimpan fitur:', err);
        alert('Gagal menyimpan fitur.');
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRole = null;
    this.selectedFeatureIds = [];
  }
}
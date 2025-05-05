import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PengajuanService } from 'src/app/service/pengajuan.service';
import { PengajuanPendingResponseDTO } from 'src/app/models/pengajuan.model';

@Component({
  selector: 'app-pengajuan-disburse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgxCustomModalComponent
  ],
  templateUrl: './pengajuan-disburse.component.html',
})
export class PengajuanDisburseComponent implements OnInit {
  private pengajuanService = inject(PengajuanService);
  private http = inject(HttpClient);

  pengajuans: PengajuanPendingResponseDTO[] = [];
  rows: PengajuanPendingResponseDTO[] = [];
  loading = false;

  selectedPengajuan: PengajuanPendingResponseDTO | null = null;

  @ViewChild('modalKonfirmasi') modalKonfirmasi!: NgxCustomModalComponent;

  readonly cols = [
    { title: 'Nama Customer', field: 'namaCustomer' },
    { title: 'Jumlah Pinjaman', field: 'amount' },
    { title: 'Tenor', field: 'tenor' },
    { title: 'Tanggal Pengajuan', field: 'tanggalPengajuan' },
    { title: 'Status', field: 'status' },
    { title: 'Catatan Manager', field: 'catatanManager' },
    { title: 'Aksi', field: 'aksi' },
  ];

  ngOnInit(): void {
    this.fetchPengajuanDisburse();
  }

  fetchPengajuanDisburse(): void {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token tidak ditemukan. Anda harus login terlebih dahulu.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<PengajuanPendingResponseDTO[]>('http://localhost:8080/api/pengajuan/pending-backoffice', { headers }).subscribe({
      next: (data) => {
        this.pengajuans = this.rows = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal mengambil data pengajuan untuk pencairan:', err);
        this.loading = false;
      }
    });
  }

  openDisburseModal(pengajuan: PengajuanPendingResponseDTO): void {
    if (pengajuan) {
      this.selectedPengajuan = pengajuan;
      this.modalKonfirmasi.open();
    } else {
      console.error('Pengajuan tidak valid:', pengajuan);
    }
  }

  konfirmasiDisburse(): void {
    if (!this.selectedPengajuan) {
      alert('Tidak ada pengajuan yang dipilih.');
      return;
    }
  
    this.pengajuanService.disbursePengajuan(this.selectedPengajuan.idPengajuan).subscribe({
      next: () => {
        alert('Pengajuan berhasil dicairkan.');
        this.modalKonfirmasi.close();
        this.fetchPengajuanDisburse(); // refresh list
      },
      error: (error) => {
        console.error('Gagal mencairkan pengajuan:', error);
        alert('Terjadi kesalahan saat mencairkan pengajuan.');
      }
    });
  }  
}
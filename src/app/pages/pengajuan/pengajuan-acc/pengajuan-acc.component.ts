import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PengajuanService } from 'src/app/service/pengajuan.service';
import { PengajuanPendingResponseDTO } from 'src/app/models/pengajuan.model';

@Component({
  selector: 'app-pengajuan-acc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgxCustomModalComponent
  ],
  templateUrl: './pengajuan-acc.component.html',
})
export class PengajuanAccComponent implements OnInit {
  private pengajuanService = inject(PengajuanService);
  private http = inject(HttpClient); // Inject HttpClient to use it directly for requests

  pengajuans: PengajuanPendingResponseDTO[] = [];
  rows: PengajuanPendingResponseDTO[] = [];
  loading = false;

  selectedPengajuan: PengajuanPendingResponseDTO | null = null;
  catatanManager = '';

  @ViewChild('modalReview') modalReview!: NgxCustomModalComponent;

  readonly cols = [
    { title: 'Nama Customer', field: 'namaCustomer' },
    { title: 'Jumlah Pinjaman', field: 'amount' },
    { title: 'Tenor', field: 'tenor' },
    { title: 'Tanggal Pengajuan', field: 'tanggalPengajuan' },
    { title: 'Status', field: 'status' },
    { title: 'Catatan Marketing', field: 'catatanMarketing' },
    { title: 'Aksi', field: 'aksi' },
  ];

  ngOnInit(): void {
    this.fetchPendingPengajuan();
  }

  fetchPendingPengajuan(): void {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token tidak ditemukan. Anda harus login terlebih dahulu.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<PengajuanPendingResponseDTO[]>('http://localhost:8080/api/pengajuan/pending-manager', { headers }).subscribe({
      next: (data) => {
        console.log('Data pending pengajuan:', data); // Pastikan data yang diterima sesuai
        this.pengajuans = this.rows = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal ambil data pengajuan pending:', err);
        this.loading = false;
      }
    });
  }  

  openReviewModal(pengajuan: PengajuanPendingResponseDTO): void {
    if (pengajuan) {
      this.selectedPengajuan = pengajuan;
      this.catatanManager = pengajuan.catatanManager || '';
      console.log('Selected Pengajuan:', this.selectedPengajuan); // Pastikan data ini ada
      this.modalReview.open(); // Pastikan modal dibuka
    } else {
      console.error('Pengajuan tidak valid:', pengajuan);
    }
  }  

  submitReview(disetujui: boolean): void {
    if (!this.selectedPengajuan) {
        console.error('Tidak ada pengajuan yang dipilih.');
        return;
    }

    const catatan = this.catatanManager.trim();

    if (!catatan) {
        alert('Catatan tidak boleh kosong.');
        return;
    }

    const payload = {
        disetujui: disetujui,
        catatan: catatan
    };

    console.log('Payload yang dikirim:', payload);

    // Mengganti POST menjadi PUT
    this.pengajuanService.approvePengajuan(this.selectedPengajuan.idPengajuan, payload).subscribe({
        next: (res) => {
          console.log('Response:', res.message); // Bisa akses .message
          alert('Review berhasil dikirim.');
          this.modalReview.close();
          this.fetchPendingPengajuan();
        },
        error: (error) => {
            console.error('Gagal kirim review:', error);
            alert('Gagal mengirim review. Silakan coba lagi.');
        }
    });
  }
}

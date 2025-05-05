import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { PengajuanService } from 'src/app/service/pengajuan.service';
import { PengajuanListResponseDTO } from 'src/app/models/pengajuan.model';

@Component({
  selector: 'app-pengajuan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableModule],
  templateUrl: './pengajuan-list.component.html',
})
export class PengajuanListComponent implements OnInit {
  private pengajuanService = inject(PengajuanService);

  pengajuans: PengajuanListResponseDTO[] = [];
  rows: PengajuanListResponseDTO[] = []; // ⬅️ ini yang kurang!
  loading = false;

  readonly cols = [
    { title: 'Nama Customer', field: 'namaCustomer' },
    { title: 'Jumlah Pinjaman', field: 'amount' },
    { title: 'Tanggal Pengajuan', field: 'tanggalPengajuan' },
    { title: 'Status', field: 'status' },
    { title: 'Marketing', field: 'namaMarketing' },
  ];

  ngOnInit(): void {
    this.fetchPengajuan();
  }

  fetchPengajuan(): void {
    this.loading = true;
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data) => {
        console.log('Data pengajuan:', data);
        this.pengajuans = this.rows = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal ambil data pengajuan:', err);
        this.loading = false;
      }
    });
  }  
}
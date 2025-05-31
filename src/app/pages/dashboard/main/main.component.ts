import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PengajuanService } from 'src/app/service/pengajuan.service';
import { PengajuanListResponseDTO } from 'src/app/models/pengajuan.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  private pengajuanService = inject(PengajuanService);

  totalPengajuanHariIni = 0;
  /**
   * Simulasi role user yang sedang login.
   * – Bisa diganti nantinya dengan service AuthService.
   * – Nilai yang mungkin: 'MARKETING' | 'MANAGER' | 'BACKOFFICE'
   */
  userRole = ""

  summaryCards = [
    {
      icon: 'bi bi-file-earmark-text',
      title: 'Total Pengajuan Hari Ini',
      value: 0, // akan diisi dari fetchTotalPengajuanHariIni()
      description: 'Semua status'
    },
    {
      icon: 'bi bi-hourglass-split',
      title: 'Pengajuan Pending Siap Proses',
      value: 0, // akan diisi dari fetchRoleBasedCount()
      description: '' // Akan disesuaikan secara dinamis
    },
    {
      icon: 'bi bi-check-circle',
      title: 'Pengajuan Disetujui Hari Ini',
      value: 0,
      description: 'Disetujui oleh manager'
    },
    {
      icon: 'bi bi-cash-stack',
      title: 'Total Pencairan Hari Ini',
      value: 'Rp 0',
      description: 'Dari Backoffice'
    }
  ];

  barChart: any;
  donutChart: any;

  ngOnInit(): void {
    // 1. Ambil total pengajuan hari ini (tanpa filter status)
    this.fetchTotalPengajuanHariIni();

    this.userRole = localStorage.getItem('role') ?? '';
    console.log('Role dari localStorage:', this.userRole);


    // 2. Ambil jumlah pengajuan yang sesuai role di hari ini
    this.fetchRoleBasedCount();
    this.fetchApprovedToday();
    this.fetchDisbursedToday();

    // 3. Inisialisasi grafik (dummy data—bisa digantikan nanti)
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data) => {
        this.initBarChart(data);
      },
      error: (err) => {
        console.error('Gagal memuat data chart pengajuan:', err);
      }
    });
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data) => {
        this.initDonutChart(data);
      },
      error: (err) => {
        console.error('Gagal mengambil data untuk donut chart:', err);
      }
    });
  }

  /**
   * 1. Kartu 1: Total Pengajuan Hari Ini (semua status)
   */
  fetchTotalPengajuanHariIni(): void {
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data) => {
        const today = new Date().toLocaleDateString();

        const count = data.filter(item => {
          if (!item.tanggalPengajuan) return false;

          const parsedDate = new Date(item.tanggalPengajuan);
          const itemDate = parsedDate.toLocaleDateString();

          return itemDate === today;
        }).length;

        this.totalPengajuanHariIni = count;
        this.summaryCards[0].value = count;

        console.log('Total pengajuan hari ini:', count);
      },
      error: (err) => {
        console.error('Gagal ambil data pengajuan:', err);
      }
    });
  }

  /**
   * 2. Kartu 2: Pengajuan sesuai role (pending/reviewed/disbursed) hari ini
   *    - Jika userRole = 'MARKETING', hitung status 'PENDING'
   *    - Jika userRole = 'MANAGER', hitung status 'REVIEWED'
   *    - Jika userRole = 'BACKOFFICE', hitung status 'DISBURSED'
   */
  fetchRoleBasedCount(): void {
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data: PengajuanListResponseDTO[]) => {
        // Tentukan status yang akan dihitung berdasarkan role
        let statusToCount: string;
        let descriptionText: string;

        switch (this.userRole) {
          case 'MARKETING':
            statusToCount = 'PENDING';
            descriptionText = 'Menunggu Marketing';
            break;
          case 'MANAGER':
            statusToCount = 'REVIEWED';
            descriptionText = 'Sudah Direview Marketing';
            break;
          case 'BACKOFFICE':
            statusToCount = 'APPROVED';
            descriptionText = 'Siap Dicairkan';
            break;
          default:
            statusToCount = '';
            descriptionText = '';
        }

        const countByRoleStatus = data.filter(item =>
          item.status === statusToCount
        ).length;

        this.summaryCards[1].value = countByRoleStatus;
        this.summaryCards[1].description = descriptionText;
      },
      error: (err) => {
        console.error('Gagal mengambil pengajuan sesuai role:', err);
      }
    });
  }

  fetchApprovedToday(): void {
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data: PengajuanListResponseDTO[]) => {
        const today = new Date().toLocaleDateString();

        const approvedToday = data.filter(item => {
          if (!item.tanggalPengajuan) return false;

          const parsedDate = new Date(item.tanggalPengajuan);
          const itemDate = parsedDate.toLocaleDateString();

          return item.status === 'APPROVED' && itemDate === today;
        }).length;

        this.summaryCards[2].value = approvedToday;
        this.summaryCards[2].description = 'Disetujui oleh manager';

        console.log('Disetujui hari ini:', approvedToday);
      },
      error: (err) => {
        console.error('Gagal mengambil pengajuan disetujui hari ini:', err);
      }
    });
  }

  fetchDisbursedToday(): void {
    this.pengajuanService.getAllPengajuan().subscribe({
      next: (data: PengajuanListResponseDTO[]) => {
        const today = new Date().toLocaleDateString();

        const totalAmountToday = data
          .filter(item => {
            if (!item.tanggalPengajuan) return false;

            const parsedDate = new Date(item.tanggalPengajuan);
            const itemDate = parsedDate.toLocaleDateString();

            return item.status === 'DISBURSED' && itemDate === today;
          })
          .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

        const formattedAmount = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(totalAmountToday);

        this.summaryCards[3].value = formattedAmount;
        this.summaryCards[3].description = 'Dari Backoffice';

        console.log('Total pencairan hari ini:', formattedAmount);
      },
      error: (err) => {
        console.error('Gagal mengambil data pencairan hari ini:', err);
      }
    });
  }

  initBarChart(data: PengajuanListResponseDTO[]): void {
    const dayMap = new Map<number, number>();

    // Inisialisasi semua hari dengan 0
    for (let i = 0; i < 7; i++) {
      dayMap.set(i, 0);
    }

    // Hitung jumlah pengajuan per hari
    data.forEach(item => {
      if (!item.tanggalPengajuan) return;

      const date = new Date(item.tanggalPengajuan);
      const day = date.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
      dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
    });

    // Susun data dalam urutan Senin → Minggu
    const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Senin–Minggu
    const chartData = orderedDays.map(day => dayMap.get(day) ?? 0);

    this.barChart = {
      series: [
        {
          name: 'Pengajuan',
          data: chartData
        },
      ],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 1
      },
      colors: ['#4361ee'],
      xaxis: {
        categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        axisBorder: {
          color: '#e0e6ed'
        }
      },
      yaxis: {
        opposite: false,
        reversed: false
      },
      grid: {
        borderColor: '#e0e6ed'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      fill: {
        opacity: 0.8
      }
    };
  }


  /**
   * 4. Inisialisasi Donut Chart (Contoh dummy data)
   */
  initDonutChart(data: PengajuanListResponseDTO[]): void {
    // Hitung total data
    const total = data.length;

    // Hitung jumlah tiap status yang relevan
    const countPending = data.filter(d => d.status === 'PENDING').length;
    const countApproved = data.filter(d => d.status === 'APPROVED').length;
    const countRejected = data.filter(d => d.status === 'REJECTED').length;
    const countDisbursed = data.filter(d => d.status === 'DISBURSED').length;

    // Jika total 0, hindari pembagian 0 (berikan array kosong atau 0 semua)
    const series = total === 0 ? [0, 0, 0, 0] : [
      Math.round((countPending / total) * 100),
      Math.round((countApproved / total) * 100),
      Math.round((countRejected / total) * 100),
      Math.round((countDisbursed / total) * 100),
    ];

    this.donutChart = {
      series: series,
      chart: {
        height: 300,
        type: 'donut',
        toolbar: {
          show: false
        }
      },
      stroke: {
        show: false
      },
      labels: ['Menunggu', 'Disetujui', 'Ditolak', 'Dicairkan'],
      colors: ['#fbbc05', '#00ffff', '#ea4335', '#00ab55'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }
      ],
      legend: {
        position: 'bottom'
      }
    };
  }
}
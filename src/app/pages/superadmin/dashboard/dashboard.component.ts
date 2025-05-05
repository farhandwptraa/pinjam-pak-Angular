import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, // WAJIB
  imports: [CommonModule], // Tambahkan jika perlu
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
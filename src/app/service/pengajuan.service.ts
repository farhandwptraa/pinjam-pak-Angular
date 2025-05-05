import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PengajuanListResponseDTO, PengajuanPendingResponseDTO } from 'src/app/models/pengajuan.model';

@Injectable({
  providedIn: 'root',
})
export class PengajuanService {
  private apiUrl = 'http://localhost:8080/api/pengajuan';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }  

  getAllPengajuan(): Observable<PengajuanListResponseDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PengajuanListResponseDTO[]>(`${this.apiUrl}/semua`, { headers });
  }

  getPendingPengajuan(): Observable<PengajuanPendingResponseDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PengajuanPendingResponseDTO[]>(`${this.apiUrl}/pending`, { headers });
  }
  
  reviewPengajuan(idPengajuan: string, payload: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/pengajuan/${idPengajuan}/review-marketing`, payload, {
        headers: this.getAuthHeaders()
    });
  }

  getPendingPengajuanManager(): Observable<PengajuanPendingResponseDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PengajuanPendingResponseDTO[]>(`${this.apiUrl}/pending-manager`, { headers });
  }

  approvePengajuan(idPengajuan: string, payload: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/pengajuan/${idPengajuan}/review-manager`, payload, {
        headers: this.getAuthHeaders()
    });
  }

  getPendingPengajuanBackoffice(): Observable<PengajuanPendingResponseDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PengajuanPendingResponseDTO[]>(`${this.apiUrl}/pending-backoffice`, { headers });
  }

  disbursePengajuan(idPengajuan: string): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/pengajuan/${idPengajuan}/disburse`,
      {}, // body kosong
      { headers: this.getAuthHeaders() }
    );
  }
}
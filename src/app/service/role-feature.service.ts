import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role, Feature, RoleFeatureDTO } from '../models/role-feature.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleFeatureService {
  private apiUrl = 'http://localhost:8080/api/role-feature';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Ambil semua role
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8080/api/employee/roles', {
      headers: this.getAuthHeaders()
    });
  }

  // Ambil semua fitur
  getAllFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/features`, {
      headers: this.getAuthHeaders()
    });
  }

  // Ambil fitur berdasarkan roleId (parameter jadi string)
  getFeaturesByRole(roleId: string): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/${roleId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Assign fitur ke role (sudah benar pakai string[])
  assignFeaturesToRole(roleId: string, featureIds: string[]): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${roleId}`,
      featureIds,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update granular fitur satu per satu (optional)
  updateMappings(payload: { roleId: string; featureId: string; enabled: boolean }[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, payload, {
      headers: this.getAuthHeaders()
    });
  }
}

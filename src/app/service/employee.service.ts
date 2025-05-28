import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeResponseDTO, RegisterEmployeeRequestDTO } from '../models/employee.model';
import { Branch } from '../models/branch.model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employee';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<EmployeeResponseDTO[]> {
    return this.http.get<EmployeeResponseDTO[]>(this.apiUrl);
  }

  getEmployeeById(id: string): Observable<EmployeeResponseDTO> {
    return this.http.get<EmployeeResponseDTO>(`${this.apiUrl}/${id}`);
  }

  registerEmployee(payload: RegisterEmployeeRequestDTO): Observable<any> {
    return this.http.post(this.apiUrl + '/register', payload);
  }

  updateEmployee(id: string, payload: RegisterEmployeeRequestDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMyBranch(): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/my-branch`);
  }

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`);
  }
}
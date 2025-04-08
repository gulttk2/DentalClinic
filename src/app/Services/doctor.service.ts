import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Doctor{
  ID: 0,
  FirstName:string,
  LastName:string,
  Specialization:string,
  Phone:string,
  Email:string
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'https://localhost:7120/api/Doctor';
  constructor(private http: HttpClient) {}
 
  getGetDoctor(): Observable<Doctor[]> {
    
    return this.http.get<Doctor[]>(`${this.apiUrl}/GetAllDoctor`);  // GetAllProducts endpoint'ini kullanın
  }

  getGetDoctorByID(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/GetDoctorByID?id=${id}`);  // GetProduct endpoint'ini kullanın
  }


}

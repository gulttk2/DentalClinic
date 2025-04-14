import { Injectable } from '@angular/core';
import { Doctor } from './doctor.service';
import { NumberInput } from '@angular/cdk/coercion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface AppointmentService{
  ID:number,
  AppointmentID:number,
  ServiceID:number,
  Appointments: Appointments,
  PatientID:number,
  Patients:Patients,
  Services:Services
  Duration: Date
}
export interface Appointments {
  ID: number;
  AppointmentDate: string;        // ISO string: "2025-04-14T12:00:00.000Z"
  IsAvailable: boolean;
  DoctorID: number;
  Doctors: Doctor;
  PatientID: number;
  Patients: Patients;
  StartTime: string | null;       // TimeSpan string: "08:30:00"
  EndTime: string | null;         // TimeSpan string: "09:00:00"
  CreatedDate: string;            // ISO string
  Status: string;
}



export interface Patients{
ID:number,
FirstName:string,
LastName:string,
Phone:string,
Email:string
}

export interface Services{
ID:number,
Name:string,
CategoryID:number,
Category:Category
}
export interface Category{
  ID: number,
  CategoryName:string,
  CategoryDescription:string
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'https://localhost:7120/api';

  constructor(private http: HttpClient) { }

  getService(): Observable<Services[]> {
    return this.http.get<Services[]>(`${this.apiUrl}/Services/GetAllService`);
  }

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Category/GetAllCategory`);
  }

  getDoctorAvailableDates(doctorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/AppointmentService/GetDoctorAvailability?doctorId=${doctorId}`);
  }

  addAppointments(request: Appointments): Observable<Appointments[]> {
    return this.http.post<Appointments[]>(`${this.apiUrl}/Appointment/CheckOrCreateUserAndAddAppointment`, request);
  }
  getAppointments(): Observable<Appointments[]> {
    return this.http.get<Appointments[]>(`${this.apiUrl}/Appointment/GetAllAppointments`);
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/Doctor/GetAllDoctor`);
  }
}

import { Injectable } from '@angular/core';
import { Doctor } from './doctor.service';
import { NumberInput } from '@angular/cdk/coercion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface AppointmentService{
  ID:number,
  AppointmentID:number,
  ServiceID:number,
  Appointments: Appointment,
  PatientID:number,
  Patients:Patients,
  Services:Services

}
export interface Appointment{
ID:number,
AppointmentDate:string,
IsAvailable:boolean,
DoctorID:number,
Doctors:Doctor
PatientID:number,
Patients:Patients
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

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/Appointment/AddAppointments`, appointment);
  }
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Appointment/GetAllAppointments`);
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/Doctor/GetAllDoctor`);
  }
}

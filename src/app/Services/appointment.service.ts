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
  Patients:Patient,
  Services:Service

}
export interface Appointment{
ID:number,
AppointmentDate:string,
DoctorID:number,
Doctors:Doctor
PatientID:number,
Patient:Patient
}

export interface Patient{
ID:number,
FirstName:string,
LastName:string,
Phone:string,
Email:string
}

export interface Service{
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


private apiUrl ='https://localhost:7120/api/AppointmentService';
constructor(private http:HttpClient) { }

getAppointmentService():Observable<AppointmentService[]>{

  return this.http.get<AppointmentService[]>(`${this.apiUrl}/GetAllAppointmentService`);

}





}

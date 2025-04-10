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
// [x: string]: any;


private apiUrl ='https://localhost:7120/api';
constructor(private http:HttpClient) { }

getAppointmentService():Observable<AppointmentService[]>{

  return this.http.get<AppointmentService[]>(`${this.apiUrl}/AppointmentService/GetAllAppointmentService`);

}
getService():Observable<Services[]>{
  return this.http.get<Services[]>(`${this.apiUrl}/Services/GetAllService`);
}
getCategory():Observable<Category[]>{
  return this.http.get<Category[]>(`${this.apiUrl}/Category/GetAllCategory`);
}

  addAppointmentService(appointmentService: AppointmentService): Observable<AppointmentService> {
    return this.http.post<AppointmentService>(`${this.apiUrl}/AppointmentService`, appointmentService);
  }
 
  
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface DoctorAvailability{
  ID: number,
  DoctorID:number,
  StartTime:string,
  EndTime:string,
  DayOfWeek:string,
  Doctors: Doctor;
}
export interface Doctor {
  ID: number;
  FirstName: string;
  LastName: string;
  Specialization: string;
  Phone: string;
  Email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorAvailabilityService {

  private apiUrl = 'https://localhost:7120/api/DoctorAvailability';
  constructor(private http: HttpClient) {}

}

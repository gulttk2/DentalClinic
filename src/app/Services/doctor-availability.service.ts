import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from './doctor.service';


export interface DoctorAvailability{
  ID: number,
  DoctorID:number,
  StartTime:string,
  EndTime:string,
  DayOfWeek:string,
  Doctors: Doctor;
  TimeSlot:string
}

@Injectable({
  providedIn: 'root'
})
export class DoctorAvailabilityService {

  private apiUrl = 'https://localhost:7120/api/DoctorAvailability';
  constructor(private http: HttpClient) {}

}

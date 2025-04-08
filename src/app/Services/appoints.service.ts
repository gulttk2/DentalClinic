import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointsService {

  private apiUrl ='https://localhost:7120/api/Appointment';
  constructor(private http:HttpClient) { }
  
getAppointment():Observable<Appointment[]>{
  return this.http.get<Appointment[]>(`${this.apiUrl}/GetAllAppointments`)
}
  
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointments } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointsService {

  private apiUrl ='https://localhost:7120/api/Appointment';
  constructor(private http:HttpClient) { }
  
getAppointment():Observable<Appointments[]>{
  return this.http.get<Appointments[]>(`${this.apiUrl}/GetAllAppointments`)
}
  
  
}

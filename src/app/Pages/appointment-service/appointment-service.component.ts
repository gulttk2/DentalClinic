import { Component, OnInit } from '@angular/core';
import { Appointments, AppointmentService } from '../../Services/appointment.service';  // Import the AppointmentService
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-appointment-service',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './appointment-service.component.html',
  styleUrls: ['./appointment-service.component.css']
})
export class AppointmentServiceComponent implements OnInit {
  appointmentServices: Appointments[] = []; 
  constructor(private appointmentService: AppointmentService, private router: Router) { }

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(
      (data: Appointments[]) => {  // Data type should be Appointment[]
        this.appointmentServices = data;
      },
      (error: HttpErrorResponse) => {  // Import and use HttpErrorResponse for error type
        console.error('Error fetching appointment services:', error);
      }
    );
  }
}

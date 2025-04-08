import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../Services/appointment.service';  // Import the AppointmentService
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-service',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './appointment-service.component.html',
  styleUrls: ['./appointment-service.component.css']
})
export class AppointmentServiceComponent implements OnInit {
  appointmentServices: AppointmentService[] = []; 

  constructor(private appointmentService: AppointmentService, private router: Router) { }

  ngOnInit(): void {
   
    this.appointmentService.getAppointmentService().subscribe(
      (data: AppointmentService[]) => {
        this.appointmentServices = data; 
      },
      (error) => {
        console.error('Error fetching appointment services:', error);
      }
    );
  }


}



import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../Services/appointment.service';
import { AppointsService } from '../../Services/appoints.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appoints',
  imports:[CommonModule],
  templateUrl: './appoints.component.html',
  styleUrls: ['./appoints.component.css'] 
})
export class AppointsComponent implements OnInit{

appoints:Appointment[]=[];

constructor(private appointService:AppointsService) {}
ngOnInit(): void {
  this.appointService.getAppointment().subscribe({
    next: (data) => this.appoints = data,
    error: (err) => console.error('Error fetching appointments', err)
  });
}




}

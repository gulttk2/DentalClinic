import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Category, Services } from '../../Services/appointment.service';
import { NgxTimepickerModule } from 'ngx-timepicker';

@Component({
  selector: 'app-doctor-detail',
  standalone: true, 
  imports: [CommonModule, 
    FormsModule,
    NgxTimepickerModule],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.css']
})
export class DoctorDetailComponent  implements OnInit {

  constructor(private appointmentService:AppointmentService) { }
  selectedCategoryId: number = 0;
  selectedServiceId = "";  
  categories: Category[] = [];
  services: Services[] = [];
  filteredServices: Services[] = [];

ngOnInit(): void {
  this.getCategories();
  this.getServices();
}

getCategories() {
  this.appointmentService.getCategory().subscribe(data => {
    this.categories = data;
  });
}

getServices() {
  this.appointmentService.getService().subscribe(data => {
    this.services = data;
  });
}

onCategoryChange() {
  this.filteredServices = this.services.filter(
    s => s.CategoryID === +this.selectedCategoryId
  );
}

}
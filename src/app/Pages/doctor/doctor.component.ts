import { Component, OnInit } from '@angular/core'; // Import OnInit
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../../Services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctorIndex: number = -1;
  selectedDate: Date | null = null;

  constructor(private http: HttpClient,private router: Router) {}

  private apiUrl = 'https://localhost:7120/api/Doctor';

  getDoctor(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/GetAllDoctor`);
  }

  ngOnInit(): void {
    this.getDoctor().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('Error fetching doctors', err)
    });
  }
  openDatepicker(index: number) {
    if (this.selectedDoctorIndex === index) {
      this.selectedDoctorIndex = -1;
    } else {
      this.selectedDoctorIndex = index;
    }
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    if (this.selectedDate) {
      this.router.navigate(['/appointment']);
    }
  }
}

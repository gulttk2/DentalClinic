import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DoctorAvailability } from '../../Services/doctor-availability.service';
import { MatDatepickerModule, MatEndDate } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-doctor-availability',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],  
  templateUrl: './doctor-availability.component.html',
  styleUrls: ['./doctor-availability.component.css']
})
export class DoctorAvailabilityComponent implements OnInit {
  doctorAvailability: DoctorAvailability[] = [];  // Doktorların müsaitlik verilerini tutacak dizi
  selectedAvailability: any = null;  // Kullanıcı seçilen müsaitlik zamanını tutacak
  selectedDate: string = '';  // Kullanıcının seçtiği tarih
  selectedTime: string = '';  // Kullanıcının seçtiği saat

  constructor(private http: HttpClient) {}

  private apiUrl = 'https://localhost:7120/api/DoctorAvailability';  // API URL

  ngOnInit(): void {
    this.getDoctorAvailability();  // Bileşen yüklendiğinde müsaitlik verilerini al
  }

  getDoctorAvailability(): void {
    this.http.get<DoctorAvailability[]>(`${this.apiUrl}/GetAllDoctorAvailabilty`).subscribe({
      next: (data) => {
        this.doctorAvailability = data;  // Verileri aldıktan sonra doctorAvailability dizisine atıyoruz
      },
      error: (err) => {
        console.error('Error fetching doctor availability', err);  // Hata durumunda loglama
      }
    });
  }

  // Kullanıcı bir doktorun müsaitlik durumuna tıkladığında bu fonksiyon çalışacak
  bookAppointment(availability: any): void {
    this.selectedAvailability = availability;  // Seçilen müsaitlik zamanını belirliyoruz
  }

  // Randevu alındığında çalışacak fonksiyon
  submitAppointment(): void {
    if (this.selectedDate && this.selectedTime) {
      // Seçilen tarihi ve saati, randevu alınmış olarak işaretleyelim
      this.selectedAvailability.isBooked = true;

      // Burada backend'e API çağrısı yapılabilir

      alert('Randevunuz başarıyla alınmıştır!');
      this.resetForm();  // Formu sıfırlama
    } else {
      alert('Lütfen geçerli bir tarih ve saat seçin.');
    }
  }

  // Formu sıfırlama
  resetForm(): void {
    this.selectedDate = '';
    this.selectedTime = '';
    this.selectedAvailability = null;
  }
}

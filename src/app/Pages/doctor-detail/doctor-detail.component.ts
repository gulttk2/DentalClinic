import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Category, Services, Patients, Appointment } from '../../Services/appointment.service';
import { NgxTimepickerModule } from 'ngx-timepicker';
import { Doctor } from '../../Services/doctor-availability.service';

@Component({
  selector: 'app-doctor-detail',
  standalone: true, 
  imports: [CommonModule, 
    FormsModule,
    NgxTimepickerModule],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.css']
})
export class DoctorDetailComponent implements OnInit {
  selectedCategoryId: number = 0;
  selectedServiceId = "";  
  categories: Category[] = [];
  services: Services[] = [];
  filteredServices: Services[] = [];
  selectedTime: string = ''; 
  selectedDate: string = '';
  selectedDoctorId: number = 0;
  availableDates: string[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  doctor: Doctor = {  // 'Doctors' tipini burada doğru şekilde kullanıyoruz
    ID: 0,
    FirstName: '',
    LastName: '',
    Specialization: '',
    Phone: '',
    Email: '',
  };
  patient: Patients = {
    ID: 0,
    FirstName: '',
    LastName: '',
    Phone: '',
    Email: ''
  };

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getServices();
    this.getDoctors();
    this.getAppointments();

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

  onDoctorChange() {
    if (this.selectedDoctorId) {
      this.appointmentService.getDoctorAvailableDates(this.selectedDoctorId).subscribe(data => {
        console.log('API Yanıtı: ', data); // API yanıtını kontrol ediyoruz
        this.availableDates = data; // Müsait saatleri availableDates dizisine atıyoruz
      }, error => {
        console.error('Hata: ', error); // Eğer hata varsa, bunu konsola yazdırıyoruz
      });
      console.log('Seçilen Doktor ID:', this.selectedDoctorId);

    }
  }
  
  getDoctors() {
    this.appointmentService.getDoctors().subscribe(data => {
      this.doctors = data; 
    });
  }
  createAppointment() {
    const selectedDoctor = this.doctors.find(doctor => doctor.ID === this.selectedDoctorId);
  
    if (selectedDoctor) {
      const appointment: Appointment = {
        ID: 0, 
        AppointmentDate: this.selectedDate + ' ' + this.selectedTime,
        IsAvailable: true,
        DoctorID: this.selectedDoctorId,
        Patients: this.patient,
        PatientID: this.patient.ID,
        Doctors: { 
          ID:0,
          FirstName: selectedDoctor.FirstName,
          LastName: selectedDoctor.LastName,
          Specialization: selectedDoctor.Specialization,
          Phone: selectedDoctor.Phone,
          Email: selectedDoctor.Email,
        },
      };
  
      this.appointmentService.addAppointment(appointment).subscribe(response => {
        alert('Randevu başarıyla oluşturuldu!');
      });
    } else {
      alert('Doktor bilgileri bulunamadı!');
    }
  }
  getAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
    });
  }

}

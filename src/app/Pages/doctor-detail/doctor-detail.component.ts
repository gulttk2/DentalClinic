import { Component, DebugElement, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Category, Services, Patients, Appointments } from '../../Services/appointment.service';
import { NgxTimepickerModule } from 'ngx-timepicker';
import { Doctor } from '../../Services/doctor.service';

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
  showTable: boolean = false;
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
  appointments: Appointments[] = [];
  doctor: Doctor = { 
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

  saatler: string[] = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30"
  ];
  
  gunler: string[] = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
  ];

  liste: { saat: string, gunler: { ad: string, deger: string }[] }[] = [];

  busyHours: { startTime: string, endTime: string }[] = [];


  constructor(private appointmentService: AppointmentService) {
    this.saatler.forEach(saat => {
      const gunlerListesi = this.gunler.map(gun => ({
        ad: gun,
        deger: "" // Gerekirse değiştir
      }));
      this.liste.push({ saat, gunler: gunlerListesi });
    });
   }

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

  randevuAl(saat: string, gun: string) {
    const secilenTarih = this.getTarihFromGun(gun); // Örn: "2025-04-17"
    this.selectedTime = saat.replace('.', ':');     // Örn: "14.30" → "14:30"
    this.selectedDate = secilenTarih;
  debugger
    console.log("Seçilen saat:", this.selectedTime);
    console.log("Seçilen tarih:", this.selectedDate, "Gün:", gun);
  
    if (this.selectedDoctorId) {
      this.createAppointment();
    } else {
      alert("Lütfen önce bir doktor seçin!");
    }
  }
  
  createAppointment() {
    const selectedPatient = this.patient; 
    const selectedDoctor = this.doctors.find(
      doctor => Number(doctor.ID) === Number(this.selectedDoctorId)
    );    
  
    console.log("Seçilen doktorun ID'si", this.selectedDoctorId);
    console.log("Bulunan doktor:", selectedDoctor);
  
    if (!selectedDoctor) {
      alert('Doktor bilgileri bulunamadı!');
      return;
    }
  
    // Tarih ve saat string'ini ISO formatına çevirelim
    const dateString = `${this.selectedDate}T${this.selectedTime}:00`;
    console.log(dateString);
    const appointmentDate = new Date(dateString);
    console.log(appointmentDate)
    if (isNaN(appointmentDate.getTime())) {
      console.error("Geçersiz tarih formatı:", dateString);
      alert('Geçersiz tarih veya saat!');
      return;
    }
  
    const startTime = new Date(appointmentDate);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 dk sonrası
  
    const formatToTimeString = (date: Date): string =>
      date.toTimeString().split(' ')[0]; // HH:mm:ss
     console.log(formatToTimeString);
    const appointments: Appointments = {
      ID: 0,
      AppointmentDate: this.formatDateTimeLocal(appointmentDate),   // DateTime
      IsAvailable: true,
      DoctorID: this.selectedDoctorId,
      PatientID: selectedPatient.ID,
      Doctors: selectedDoctor,
      Patients: selectedPatient,
      StartTime: formatToTimeString(startTime), 
      EndTime: formatToTimeString(endTime),
      CreatedDate: new Date().toISOString(),                      
      Status: 'Active'
    };
    console.log(appointments);
    this.appointmentService.addAppointments(appointments).subscribe({
      next: () => alert('Randevu başarıyla oluşturuldu!'),
      error: () => alert('Randevu oluşturulurken bir hata oluştu.')
    });
  }
  
  
  
  formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  
  
  
  getAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
    });
  }


  updateAppointmentTable() {
    for (let row of this.liste) {
      for (let gun of row.gunler) {
        const appointmentDate = new Date(gun.ad); // gun.ad = tarih
        
        const saat = row.saat; // saat = örneğin "10:00"
        const selectedDateTime = new Date(`${appointmentDate.toDateString()} ${saat}`);
  
        gun.deger = ''; // Önce boş
        for (let appt of this.busyHours) {
          const start = new Date(appt.startTime);
          const end = new Date(appt.endTime);
  
          if (selectedDateTime >= start && selectedDateTime < end) {
            gun.deger = 'Dolu'; // Eğer çakışıyorsa işaretle
            break;
          }
        }
      }
    }
  }
  

  getTarihFromGun(gun: string): string {
    const bugun = new Date();
    const gunlerMap: { [key: string]: number } = {
      "Pazar": 0, "Pazartesi": 1, "Salı": 2, "Çarşamba": 3,
      "Perşembe": 4, "Cuma": 5, "Cumartesi": 6
    };
  
    const hedefGun = gunlerMap[gun];
    const bugunGun = bugun.getDay();
    const fark = (hedefGun + 7 - bugunGun) % 7;
  
    const hedefTarih = new Date();
    hedefTarih.setDate(bugun.getDate() + fark);
  
    return hedefTarih.toISOString().split("T")[0]; 
  }
  




}

import { Component, OnInit } from '@angular/core';
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

  createAppointment() {
    const selectedPatient = this.patient; 
    const selectedDoctor = this.doctors.find(
      doctor => Number(doctor.ID) === Number(this.selectedDoctorId)
    );    
    
    console.log("Seçilen doktorun ID'si", this.selectedDoctorId);
    console.log("Bulunan doktor:", selectedDoctor);
  
    if (selectedDoctor) {
  
      // Seçilen tarih ve saati Date objesine çevirme
      const appointmentDate = new Date(`${this.selectedDate}T${this.selectedTime}:00`);
      if (isNaN(appointmentDate.getTime())) {
        alert('Geçersiz tarih veya saat!');
        return;
      }
        
      const startTime = new Date(appointmentDate);
  
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);  
  
      const createdDate = new Date();
      if (this.selectedDoctorId == null) {
        alert("Doktor seçilmeden randevu oluşturulamaz!");
        return;
      }
      function formatToTimeString(date: Date): string {
        return date.toTimeString().split(' ')[0]; // "HH:mm:ss"
      }
      
      const appointments: Appointments = {
        ID: 0,
        AppointmentDate: new Date(appointmentDate).toISOString(),   // DateTime
        IsAvailable: true,
        DoctorID: this.selectedDoctorId,
        PatientID: selectedPatient.ID,
        Doctors: selectedDoctor,
        Patients: selectedPatient,
        StartTime: startTime ? formatToTimeString(new Date(startTime)) : null, 
        EndTime: endTime ? formatToTimeString(new Date(endTime)) : null,
        CreatedDate: new Date().toISOString(),                      
        Status: 'Active'
      };
      
      
    
      this.appointmentService.addAppointments(appointments).subscribe(response => {
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




  randevuAl(saat: string, gun: string) {
    const secilenTarih = this.getTarihFromGun(gun);
    this.selectedTime = saat.replace('.', ':'); 
    this.selectedDate = secilenTarih;
  
    console.log(this.selectedTime);
    console.log(this.selectedDate, gun);
  
    if (this.selectedDoctorId) {
      this.createAppointment();
    } else {
      alert("Lütfen önce bir doktor seçin!");
    }
  }

  // randevuAl(saat: string, gun: string) {
  //   if (gun === 'Dolu' || gun === 'disabled') {
  //     console.log("Bu saat dolu, randevu alamazsınız!");
  //     return; // Eğer saat doluysa, işlemi sonlandır
  //   }
  //   // Randevu alma işlemi burada yapılır
  //   console.log("Randevu alındı!");
  // }
  

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

import { Component, DebugElement, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Category, Services, Patients, Appointments } from '../../Services/appointment.service';
import { NgxTimepickerModule } from 'ngx-timepicker';
import { Doctor } from '../../Services/doctor.service';
import emailjs from 'emailjs-com';

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

  onaylandiMi: boolean = false;
  selectedDay: string = '';
  
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
        console.error('Hata: ', error); 
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
    const secilenTarih = this.getTarihFromGun(gun);
    const onay = confirm(`Randevunuzu ${secilenTarih} ${saat} olarak onaylıyor musunuz?`);
    
    if (onay) {
      this.selectedTime = saat.replace('.', ':');
      this.selectedDate = secilenTarih;
      this.onaylandiMi = true;
    } else {
      this.onaylandiMi = false;
    }
  }
  
  
  createAppointment() {
    const selectedPatient = this.patient; 
    const selectedDoctor = this.doctors.find(
      doctor => Number(doctor.ID) === Number(this.selectedDoctorId)
    );    
  
    if (!selectedDoctor) {
      alert('Doktor bilgileri bulunamadı!');
      return;
    }
  
    const dateString = `${this.selectedDate}T${this.selectedTime}:00`;
    const appointmentDate = new Date(dateString);
  
    if (isNaN(appointmentDate.getTime())) {
      console.error("Geçersiz tarih formatı:", dateString);
      alert('Geçersiz tarih veya saat!');
      return;
    }
  
    const startTime = new Date(appointmentDate);
  
    const selectedService = this.services.find(
      s => s.ID === +this.selectedServiceId
    );
  
    if (!selectedService) {
      alert('Hizmet bilgisi bulunamadı!');
      return;
    }
  
    const durationInMinutes = this.parseDuration(selectedService.Duration); // 👈 dönüşüm yapıldı
    const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);
  
    const formatToTimeString = (date: Date): string =>
      date.toTimeString().split(' ')[0]; // HH:mm:ss
  
    const appointments: Appointments = {
      ID: 0,
      AppointmentDate: this.formatDateTimeLocal(appointmentDate),
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
  
    this.appointmentService.addAppointments(appointments).subscribe({
      next: () => {
        alert('Randevu başarıyla oluşturuldu!');
        this.updateAppointmentTable(); 

        // this.sendEmail();
        this.onaylandiMi = false; 
      },
      error: () => alert('Bu saatte başka bir randevu var... Başka bir saat için tekrar deneyiniz')
    });
  }
  

  // sendEmail(): void {
  //   const templateParams = {
  //     title: "Dental CLinic",
  //     name: this.patient.FirstName + ' ' + this.patient.LastName,
  //     time: `${this.selectedDate} ${this.selectedTime}`,
  //     message: `Randevunuz Dr. ${this.doctors.find(d => d.ID === this.selectedDoctorId)?.FirstName} ile oluşturuldu `,
  //     email: this.patient.Email
  //   };
    
  //   emailjs.send('service_y2xpc4c', 'template_ttsc15j', templateParams, 'lEX8t3arRmIs4mSiT')
  //     .then(() => {
  //       console.log('E-posta başarıyla gönderildi!');
  //     }, (error) => {
  //       console.error('E-posta gönderme hatası:', error);
  //     });
  // }
  
  
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
  
  isAvailable(saat: string, gun: string): boolean {
    const tarih = this.getTarihFromGun(gun); // Örn: 2025-04-17
    const dateTimeString = `${tarih}T${saat}:00`;
    return this.availableDates.includes(dateTimeString);
  }
  
  getAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
  
      // 👇 busyHours dizisini güncelle
      this.busyHours = data.map(appt => ({
        startTime: `${appt.AppointmentDate.split('T')[0]}T${appt.StartTime}`,
        endTime: `${appt.AppointmentDate.split('T')[0]}T${appt.EndTime}`
      }));
  
      this.updateAppointmentTable(); // tabloyu güncelle
    });
  }
  
  updateAppointmentTable() {
    for (let row of this.liste) {
      for (let gun of row.gunler) {
        const tarih = this.getTarihFromGun(gun.ad); // "2025-04-17" gibi
        const saat = row.saat; // "10:00" gibi
  
        const selectedDateTime = new Date(`${tarih}T${saat}:00`);
        gun.deger = ''; // Başlangıçta boş
  
        for (let appt of this.busyHours) {
          const start = new Date(appt.startTime);
          const end = new Date(appt.endTime);
  
          // Eğer bu hücredeki saat bu aralığın içindeyse “Dolu” olarak işaretle
          if (selectedDateTime >= start && selectedDateTime < end) {
            gun.deger = 'Dolu';
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
  

  parseDuration(durationStr: string): number {
    const parts = durationStr.split(':').map(part => parseInt(part, 10));
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    return hours * 60 + minutes;
  }
  


}

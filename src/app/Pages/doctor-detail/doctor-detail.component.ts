import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../Services/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-doctor-detail',
  standalone: true, 
  imports: [CommonModule, 
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.css']
})
export class DoctorDetailComponent implements OnInit {
  currentDate: Date = new Date();
  days: Array<any> = [];
  currentMonth: string = '';
  currentYear: number = 0;
  selectedDay: any = null;
  timeSlots: Array<string> = [];
  selectedTimeSlot: string = ''; // Seçilen zaman dilimi


  ngOnInit(): void {
    this.updateCalendar();
  }

  updateCalendar() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    this.currentMonth = this.getMonthName(month);
    this.currentYear = year;
    this.days = this.generateCalendarDays(year, month);
  }

  generateCalendarDays(year: number, month: number): Array<any> {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Array<any> = [];

    let prevMonthDays = firstDay.getDay();
    if (prevMonthDays > 0) {
      const prevMonth = new Date(year, month, 0);
      for (let i = prevMonth.getDate() - prevMonthDays + 1; i <= prevMonth.getDate(); i++) {
        days.push({ date: i, isCurrentMonth: false });
      }
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: i, isCurrentMonth: true });
    }

    const nextMonthDays = 42 - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ date: i, isCurrentMonth: false });
    }

    return days;
  }

  changeMonth(direction: string) {
    if (direction === 'prev') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }
    this.updateCalendar();
  }

  selectDay(day: any) {
    if (day.isCurrentMonth) {
      this.selectedDay = day;
      this.days.forEach(d => d.isSelected = false);
      day.isSelected = true;

      // Saat dilimlerini oluştur
      this.timeSlots = this.generateTimeSlots();
    }
  }

  generateTimeSlots(): Array<string> {
    const slots: Array<string> = [];
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Başlangıç saati 10:00

    // Saat dilimlerini 30 dakikalık aralıklarla oluştur
    for (let i = 0; i < 16; i++) { // 16 slot, yani 10:00 - 18:00 arası
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      let timeSlot = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;
      slots.push(timeSlot);
      currentTime.setMinutes(currentTime.getMinutes() + 30); // 30 dakika ekle
    }

    return slots;
  }

  selectTime(slot: string) {
    this.selectedTimeSlot = slot; // Seçilen saati sakla
  }

  isToday(day: any): boolean {
    const today = new Date();
    return day.date === today.getDate() &&
           today.getMonth() === this.currentDate.getMonth() &&
           today.getFullYear() === this.currentDate.getFullYear();
  }

  getMonthName(month: number): string {
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return monthNames[month];
  }

  // Seçilen saat diliminin stilini ayarlamak için yardımcı fonksiyon
  getSlotClass(slot: string): string {
    return this.selectedTimeSlot === slot ? 'selected-slot' : ''; // Eğer seçilen saat ise 'selected-slot' sınıfını ekle
  }
}

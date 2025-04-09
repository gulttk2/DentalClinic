import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PatientFiles, PatientFilesService } from '../../Services/patient-files.service';
import { AppointmentService } from '../../Services/appointment.service';

@Component({
  selector: 'app-patient-files',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './patient-files.component.html',
  styleUrls: ['./patient-files.component.css']
})
export class PatientFilesComponent implements OnInit {

patientFiles : PatientFiles[] =[];
constructor(private patientFileService:PatientFilesService) {}

ngOnInit(): void {
  this.patientFileService.getPatientFile().subscribe({
    next: (data) => this.patientFiles = data,
    error: (err) => console.error("Error fetching patient files", err)
  });
}

}

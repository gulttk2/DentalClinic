import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patients } from './appointment.service';

export interface PatientFiles{
ID:number,
PatientID:number,
Patients:Patients,
FileName:string,
TypeID:number,
FilePath:string,
UploadTime:string,
FileType:FileType,
}

export interface FileType{
ID:number,
TypeName:string
}



@Injectable({
  providedIn: 'root'
})
export class PatientFilesService {

  private apiUrl = 'https://localhost:7120/api/PatientsFile';
  constructor(private http:HttpClient) { }

getPatientFile():Observable<PatientFiles[]>{
  return this.http.get<PatientFiles[]>(`${this.apiUrl}/GetAllPatientFile`);
}






}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface Email{
  to:string,
  subject: string,
  text: string,
  resultMessage : string,  
}

@Injectable({
  providedIn: 'root'
})



export class MailService {

  private apiUrl = 'https://localhost:7120/api/mail/sendmail'; 

  constructor(private http: HttpClient) { }



  sendEmail(to: string, subject: string, text: string) {
    const body = { to, subject, text };
    return this.http.post(this.apiUrl, body);
  }
  sendEmailObject(email: Email) {
    return this.http.post(this.apiUrl, email);
  }
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl = 'https://localhost:7120/api/mail'; // .NET API endpoint'in

  constructor(private http: HttpClient) { }

  sendMail(to: string, subject: string, body: string) {
    const payload = {
      to,
      subject,
      body
    };

    return this.http.post(this.apiUrl, payload);
  }
}


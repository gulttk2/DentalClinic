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


downloadFile(id: number): void {
  this.patientFileService.downloadPatientFile(id).subscribe({
    next: (response) => {
      const blob = response.body;
      if (blob instanceof Blob) {
        const contentType = response.headers.get('Content-Type');
        let fileExtension = '';

        if (contentType?.includes('application/pdf')) fileExtension = '.pdf';
        else if (contentType?.includes('text/plain')) fileExtension = '.txt';
        else if (contentType?.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) fileExtension = '.docx';
        else if (contentType?.includes('image/jpeg')) fileExtension = '.jpg';
        else if (contentType?.includes('image/png')) fileExtension = '.png';
        else if (contentType?.includes('application/zip')) fileExtension = '.zip';

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'default' + fileExtension;

        if (contentDisposition) {
          // Hem filename hem filename* desteği
          const match = contentDisposition.match(/filename\*?=(?:UTF-\d['']*)?"?([^";]+)"?/);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1]);
          }
        }

        console.log("Çekilen dosya adı:", filename);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    error: (err) => {
      console.error("İndirme hatası:", err);
      alert("Dosya indirilemedi.");
    }
  });
}























// downloadFile(id: number): void {
//   this.patientFileService.downloadPatientFile(id).subscribe({
//     next: (response) => {
//       console.log(response);  // Yanıtı kontrol edin
//       const blob = response.body;
//       if (blob instanceof Blob) {
//         // Content-Type kontrolü
//         const contentType = response.headers.get('Content-Type');
//         let fileExtension = '';

//         if (contentType?.includes('application/pdf')) {
//           fileExtension = '.pdf';
//         } else if (contentType?.includes('text/plain')) {
//           fileExtension = '.txt';
//         } else if (contentType?.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
//           fileExtension = '.docx';
//         } else if (contentType?.includes('image/jpeg')) {
//           fileExtension = '.jpg';
//         } else if (contentType?.includes('image/png')) {
//           fileExtension = '.png';
//         } else if (contentType?.includes('application/zip')) {
//           fileExtension = '.zip';
//         } else {
//           console.error('Desteklenmeyen dosya türü:', contentType);
//           return;
//         }

//         // Dosya adını API yanıtından almak için burayı kontrol edin
//         let filename = response.body?.filename || 'unknown-file';  // Dosya adı burada kontrol edilmelidir

//         // Eğer FileName yoksa veya geçersizse, default olarak 'unknown-file' adı kullanılır.
//         if (!filename) {
//           filename = `default-filename${fileExtension}`;
//         }

//         // Dosyayı indir
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = filename; // Dinamik dosya adı
//         a.click();
//         window.URL.revokeObjectURL(url);  // Temizle
//       } else {
//         console.error('Yanıt Blob tipi değil.');
//       }
//     },
//     error: (error) => {
//       console.error('İndirme hatası:', error);
//       alert('Dosya indirilemedi. Lütfen tekrar deneyin.');
//     }
//   });
// }

}





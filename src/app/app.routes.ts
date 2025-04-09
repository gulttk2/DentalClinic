import { Routes } from '@angular/router';
import { DoctorComponent } from './Pages/doctor/doctor.component';
import { DoctorAvailabilityComponent } from './Pages/doctor-availability/doctor-availability.component';
import { AppointmentService } from './Services/appointment.service';
import { DoctorDetailComponent } from './Pages/doctor-detail/doctor-detail.component';
import { AppointsComponent } from './Pages/appoints/appoints.component';
import { AppointmentServiceComponent } from './Pages/appointment-service/appointment-service.component';
import { PatientFilesComponent } from './Pages/patient-files/patient-files.component';

export const routes: Routes = [
    {path:'', redirectTo:'doctor',pathMatch:'full'},
    {path:"doctor", component:DoctorComponent },
    {path:"doctorAvailability", component:DoctorAvailabilityComponent },
    {path:"appointment", component:AppointmentServiceComponent },
    {path:"doctorDetail", component:DoctorDetailComponent },
    {path:"appoint", component:AppointsComponent },
    {path:"patientFile", component:PatientFilesComponent },


];

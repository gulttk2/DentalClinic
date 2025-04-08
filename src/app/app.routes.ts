import { Routes } from '@angular/router';
import { DoctorComponent } from './Pages/doctor/doctor.component';
import { DoctorAvailabilityComponent } from './Pages/doctor-availability/doctor-availability.component';
import { AppointmentService } from './Services/appointment.service';
import { DoctorDetailComponent } from './Pages/doctor-detail/doctor-detail.component';

export const routes: Routes = [
    {path:'', redirectTo:'doctor',pathMatch:'full'},
    {path:"doctor", component:DoctorComponent },
    {path:"doctorAvailability", component:DoctorAvailabilityComponent },
    {path:"appointment", component:AppointmentService },
    {path:"doctorDetail", component:DoctorDetailComponent },
    {path:"appoint", component:AppointmentService },



];

import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'profile', component: ProfileComponent},  
];

import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SearchComponent } from './features/search/search.component';
import { SearchGuard } from './core/guards/search.guard';
import {RegisterComponent} from './features/register/register.component';
import {LoginComponent} from './features/login/login.component';
import { UploadComponent } from './features/upload/upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'profile', component: ProfileComponent},
  { path: 'search/:title', component: SearchComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''}

];

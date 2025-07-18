import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SearchComponent } from './features/search/search.component';
import { SearchGuard } from './core/guards/search.guard';
import {RegisterComponent} from './features/register/register.component';
import {LoginComponent} from './features/login/login.component';
import {ProfileSettingsComponent} from './features/profile-settings/profile-settings.component';
import {AuthGuard} from './core/guards/auth.guard';
import { UploadComponent } from './features/upload/upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'profile', component: ProfileComponent},
  { path: 'search/:title', component: SearchComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'edit-profile', component: ProfileSettingsComponent, canActivate: [AuthGuard]},
  { 
    path: 'upload', 
    component: UploadComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' },
      { path: 'select', loadComponent: () => import('./shared/components/upload-preview/upload-preview.component').then(c => c.UploadPreviewComponent) },
      { path: 'edit', loadComponent: () => import('./shared/components/upload-submit/upload-submit.component').then(c => c.UploadSubmitComponent) }
    ]
  },
  {path: '**', redirectTo: ''}

];

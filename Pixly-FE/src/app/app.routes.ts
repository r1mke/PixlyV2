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
import { AdminComponent } from '../app/features/admin/admin.component';

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
  {
  path: 'admin',
  component: AdminComponent,
  children: [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { 
      path: 'overview', 
      loadComponent: () => import('./features/admin/overview/overview.component').then(c => c.OverviewComponent) 
    },
    { 
       path: 'content', 
       loadComponent: () => import('./features/admin/content/content.component').then(c => c.ContentComponent) 
    },
    // { 
    //   path: 'users', 
    //   loadComponent: () => import('./features/admin/users/users.component').then(c => c.UsersComponent) 
    // },
    // { 
    //   path: 'photos', 
    //   loadComponent: () => import('./features/admin/photos/photos.component').then(c => c.PhotosComponent) 
    // },
    // { 
    //   path: 'tags', 
    //   loadComponent: () => import('./features/admin/tags/tags.component').then(c => c.TagsComponent) 
    // },
    // { 
    //   path: 'settings', 
    //   loadComponent: () => import('./features/admin/settings/settings.component').then(c => c.SettingsComponent) 
    // }
  ]
  },
  {path: '**', redirectTo: ''}

];

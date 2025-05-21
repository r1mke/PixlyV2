import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SearchComponent } from './features/search/search.component';
import { SearchGuard } from './core/guards/search.guard';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'profile', component: ProfileComponent}, 
  { path: 'search/:title', component: SearchComponent, canActivate: [SearchGuard] }, 
  {path: '**', redirectTo: ''} 
];

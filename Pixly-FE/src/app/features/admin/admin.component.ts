import { Component } from '@angular/core';
import { SideBarComponent } from "../../shared/components/side-bar/side-bar.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { User } from '../../core/models/DTOs/User';
import { Router,NavigationEnd  } from '@angular/router';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser: User | null = null;
  title: string = 'Overview';
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
          this.currentUser = user;
      })
     
      this.updatePageTitle(); 

       this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(() => {
        this.updatePageTitle();
      });
  }

   private updatePageTitle() {
    const urlSegments = this.router.url.split('/');
    const adminIndex = urlSegments.indexOf('admin');
    
    if (adminIndex !== -1 && urlSegments[adminIndex + 1]) {
      this.title = urlSegments[adminIndex + 1]; 
    } else {
      this.title = 'overview'; 
    }
  }

  sendTitleToParent(title:string): void {
    this.title = title;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.title = 'Overview';
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    }
    )
  }
}

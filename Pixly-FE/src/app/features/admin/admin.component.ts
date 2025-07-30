import { Component } from '@angular/core';
import { SideBarComponent } from "../../shared/components/side-bar/side-bar.component";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { User } from '../../core/models/DTOs/User';
import { Router } from '@angular/router';
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
  
  ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
          this.currentUser = user;
      })
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

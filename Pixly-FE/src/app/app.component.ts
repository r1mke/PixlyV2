// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'Pixly';

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Try to refresh token using only refresh token cookie
    this.authService.refreshToken(null).subscribe({
      next: response => {
        // After successful refresh, get user data
        this.authService.getCurrentUser().subscribe();
      },
      error: error => {
        // Not logged in, which is fine - no redirect needed
      }
    });
  }
}

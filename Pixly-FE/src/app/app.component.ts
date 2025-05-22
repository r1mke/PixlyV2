// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

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
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.tokenService.getToken()) {
      this.tryRefreshToken();
    }
    else {
      this.verifyTokenAndGetUser();
    }
  }

  private tryRefreshToken() {
    this.authService.refreshToken(null).subscribe({
      next: response => {
        this.authService.getCurrentUser().subscribe({
          next: user => {},
        });
      },
      error: error => {}
    });
  }

  private verifyTokenAndGetUser() {
    this.authService.getCurrentUser().subscribe({
      next: user => {},
      error: error => {
        if (error.status === 401) {
          this.tryRefreshToken();
        }
      }
    });
  }
}

// src/app/app.component.ts
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

  // app.component.ts
  ngOnInit() {
    // Pokušaj osvježiti token koristeći samo refresh token kolačić
    this.authService.refreshToken(null).subscribe({
      next: response => {
        console.log('Sesija nastavljena koristeći refresh token');
        // Nakon uspješnog osvježavanja, dohvati korisničke podatke
        this.authService.getCurrentUser().subscribe();
      },
      error: error => {
        console.log('Sesija istekla, potrebna nova prijava');
        // Korisnik nije prijavljen, ali to je OK - nema potrebe za preusmjeravanjem
      }
    });
  }

  private checkAuthentication() {
    // Ako imamo token, provjerimo je li valjan
    const token = this.tokenService.getToken();
    if (token) {
      console.log('Pronađen token pri pokretanju, provjeravam valjanost...');

      this.authService.getCurrentUser().subscribe({
        next: response => {
          console.log('Korisnik uspješno autentificiran:', response);
        },
        error: error => {
          console.log('Greška pri dohvatu korisnika:', error);

          // Ako je token istekao (401), pokušaj ga osvježiti
          if (error.status === 401) {
            console.log('Token istekao, pokušavam osvježavanje...');

            this.authService.refreshToken(token).subscribe({
              next: refreshResponse => {
                console.log('Token uspješno osvježen', refreshResponse);

                // Ponovo dohvati korisnika
                this.authService.getCurrentUser().subscribe({
                  next: userResponse => {
                    console.log('Korisnik dohvaćen nakon osvježavanja tokena:', userResponse);
                  },
                  error: userError => {
                    console.error('Greška nakon osvježavanja tokena:', userError);
                    this.tokenService.clearToken();
                    this.router.navigate(['/login']);
                  }
                });
              },
              error: refreshError => {
                console.error('Neuspjelo osvježavanje tokena:', refreshError);
                this.tokenService.clearToken();
                this.router.navigate(['/login']);
              }
            });
          }
        }
      });
    }
  }
}

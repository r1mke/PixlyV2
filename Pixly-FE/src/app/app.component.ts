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
    // Pokušaj osvježiti token prilikom učitavanja
    this.authService.checkAuth().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('Korisnik je uspješno autentificiran');
      } else {
        console.log('Korisnik nije autentificiran');
      }
    });
  }
}

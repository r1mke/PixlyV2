import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { AuthState } from './core/state/auth.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {LoadingComponent} from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Pixly';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private authState: AuthState,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const hasToken = this.authState.hasToken();
    const hasUser = !!this.authState.currentUser;

    if (hasToken && hasUser) {
      return;
    }

    if (hasToken && !hasUser) {
      this.verifyTokenAndGetUser();
      return;
    }

    if (!hasToken) {
      this.tryRefreshToken();
      return;
    }
  }

  private verifyTokenAndGetUser() {
    this.authService.getCurrentUser().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: user => {},
      error: error => {
        if (error.status === 401) {this.tryRefreshToken();}
        else {}
      }
    });
  }

  private tryRefreshToken() {
    this.authService.refreshToken(null).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: response => {
        this.authService.getCurrentUser().pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: user => {},
          error: error => {}
        });
      },
      error: error => {}
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

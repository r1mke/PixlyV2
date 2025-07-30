import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingComponent } from './shared/components/loading/loading.component';

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
  ) { }

  ngOnInit() {
    this.initializeAuth();
  }

  private initializeAuth() {
    this.authService.initializeAuthIfNeeded().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (isAuthenticated) => { },
      error: (error) => { }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
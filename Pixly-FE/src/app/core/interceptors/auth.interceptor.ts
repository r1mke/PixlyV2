import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthState } from '../state/auth.state';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authState: AuthState,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = request.clone({ withCredentials: true });

    const token = this.authState.token;
    if (token) {
      newRequest = newRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing && !request.url.includes('refresh-token')) {
          this.isRefreshing = true;

          return this.authService.refreshToken(token).pipe(
            switchMap(response => {
              this.isRefreshing = false;
              return next.handle(newRequest.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authState.token}`
                }
              }));
            }),
            catchError(refreshError => {
              this.isRefreshing = false;
              this.authState.clearToken();
              this.router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}

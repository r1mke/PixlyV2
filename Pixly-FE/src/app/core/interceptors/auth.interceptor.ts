import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = request.clone({ withCredentials: true });

    const token = this.tokenService.getToken();
    if (token) {
      newRequest = newRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(newRequest).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body?.data?.token) {
            this.tokenService.setToken(event.body.data.token);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'object' &&
          error.error.success === true && error.error.token) {

          this.tokenService.setToken(error.error.token);

          return next.handle(newRequest.clone({
            setHeaders: {
              Authorization: `Bearer ${error.error.token}`
            }
          }));
        }

        if (error.status === 401 && !this.isRefreshing &&
          !newRequest.url.includes('refresh-token')) {

          this.isRefreshing = true;
          const oldToken = this.tokenService.getToken();

          return this.authService.refreshToken(oldToken).pipe(
            switchMap(response => {
              this.isRefreshing = false;

              const newToken = this.tokenService.getToken();

              return next.handle(request.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              }));
            }),
            catchError(refreshError => {
              this.isRefreshing = false;
              this.tokenService.clearToken();
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

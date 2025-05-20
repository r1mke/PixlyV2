import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Dodaj token samo ako ga imamo
    const token = this.tokenService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Provjeri X-New-Token header
          const newToken = event.headers.get('X-New-Token');
          if (newToken) {
            console.log('Novi token primljen u headeru');
            this.tokenService.setToken(newToken);
          }

          // Provjeri token u tijelu odgovora
          if (event.body?.data?.token) {
            console.log('Novi token primljen u body-u');
            this.tokenService.setToken(event.body.data.token);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Ako je 401/403, a zahtjev nije za current-user, redirect na login
        if ((error.status === 401 || error.status === 403) &&
          !request.url.includes(`${environment.apiUrl}/auth/current-user`)) {
          this.tokenService.clearToken();
          this.router.navigate(['/login']);
        }

        // Ako je error zapravo 200 s tokenom (tvoj middleware odgovor)
        if (error.status === 200 && error.error?.token) {
          console.log('Novi token primljen u error objektu');
          this.tokenService.setToken(error.error.token);

          // Preoblikuj zahtjev s novim tokenom i ponovi ga
          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${error.error.token}`
            }
          });

          // Nastavi s zahtjevom s novim tokenom
          return next.handle(newRequest);
        }

        return throwError(() => error);
      })
    );
  }
}

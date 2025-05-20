import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RegisterRequest} from '../models/DTOs/Request/RegisterRequest';
import {Observable, catchError, of, tap, map} from 'rxjs';
import {ApiResponse} from '../models/Response/api-response';
import {RegisterResponse} from '../models/Response/RegisterResponse';
import {TokenService} from './token.service';
import {environment} from '../../../environments/environment';
import {User} from '../models/DTOs/User';

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // Ovo će se pozvati pri učitavanju aplikacije
  checkAuth(): Observable<boolean> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/current-user`).pipe(
      tap(response => {
        // Token će biti osvježen kroz interceptor
        console.log('Korisnik je autentificiran');
      }),
      // Pretvaramo odgovor u boolean (true - autentificiran)
      map(() => true),
      catchError(error => {
        console.log('Korisnik nije autentificiran', error);
        return of(false);
      })
    );
  }

  register(values: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.baseUrl}/register`, values)
      .pipe(
        tap(response => {
          if (response.success && response.data.token) {
            this.tokenService.setToken(response.data.token);
          }
        })
      );
  }

  login(email: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.data.token) {
            this.tokenService.setToken(response.data.token);
          }
        })
      );
  }

  logout(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.tokenService.clearToken();
        })
      );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/current-user`);
  }
}

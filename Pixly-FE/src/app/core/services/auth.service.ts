// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/DTOs/Request/RegisterRequest';
import { Observable, catchError, of, tap, map } from 'rxjs';
import { ApiResponse } from '../models/Response/api-response';
import { RegisterResponse } from '../models/Response/RegisterResponse';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { User } from '../models/DTOs/User';

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

  refreshToken(oldToken: string | null): Observable<ApiResponse<any>> {
    const requestBody = oldToken ? { token: oldToken } : {};

    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/refresh-token`, requestBody, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data?.token) {
          this.tokenService.clearToken();
          this.tokenService.setToken(response.data.token);
        }
      })
    );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/current-user`, {
      withCredentials: true
    });
  }

  register(values: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.baseUrl}/register`, values, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          this.tokenService.setToken(response.data.token);
        }
      })
    );
  }

  login(email: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/login`, { email, password }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          this.tokenService.setToken(response.data.token);
        }
      })
    );
  }

  logout(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.tokenService.clearToken();
      })
    );
  }
}

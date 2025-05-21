// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/DTOs/Request/RegisterRequest';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/Response/api-response';
import { RegisterResponse } from '../models/Response/RegisterResponse';
import { environment } from '../../../environments/environment';
import { User } from '../models/DTOs/User';
import { AuthState } from '../state/auth.state';

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
    private authState: AuthState
  ) {}

  refreshToken(oldToken: string | null): Observable<ApiResponse<any>> {
    const requestBody = oldToken ? { token: oldToken } : {};

    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/refresh-token`, requestBody, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data?.token) {
          this.authState.setToken(response.data.token);
        }
      })
    );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/current-user`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          // Use the public method instead of accessing the subject directly
          this.authState.updateCurrentUser(response.data);
        }
      })
    );
  }

  register(values: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.baseUrl}/register`, values, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          this.authState.setToken(response.data.token);
          this.authState.loadCurrentUser().subscribe();
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
          this.authState.setToken(response.data.token);
          this.authState.loadCurrentUser().subscribe();
        }
      })
    );
  }

  logout(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.authState.clearToken();
      })
    );
  }
}

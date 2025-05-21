import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/Request/RegisterRequest';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/Response/api-response';
import { AuthResponse } from '../models/Response/AuthResponse';
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
          this.authState.updateCurrentUser(response.data);
        }
      })
    );
  }

  register(values: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, values, {
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

  login(values: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, values, {
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
    this.authState.loadCurrentUser().subscribe();
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.authState.clearToken();
      })
    );
  }
}

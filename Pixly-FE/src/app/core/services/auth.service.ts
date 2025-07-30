import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/Request/RegisterRequest';
import { Observable, tap, of } from 'rxjs';
import { ApiResponse } from '../models/Response/api-response';
import { AuthResponse } from '../models/Response/AuthResponse';
import { environment } from '../../../environments/environment';
import { User } from '../models/DTOs/User';
import { AuthState } from '../state/auth.state';
import { LoginRequest } from '../models/Request/LoginRequest';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private authState: AuthState
  ) { }

  get isLoggedIn$() {
    return this.authState.isLoggedIn$;
  }

  get currentUser$() {
    return this.authState.currentUser$;
  }

  initializeAuthIfNeeded(): Observable<boolean> {
    if (this.authState.currentUser) {
      return of(true);
    }

    if (this.authState.hasToken()) {
      return this.refreshToken(null).pipe(
        switchMap(refreshResponse => {
          if (refreshResponse.success) {
            return this.getCurrentUser().pipe(
              map(userResponse => userResponse.success && !!userResponse.data)
            );
          }
          return of(false);
        }),
        catchError(() => of(false))
      );
    }

    return of(false);
  }

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
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.authState.clearToken();
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/DTOs/User';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/Response/api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private readonly TOKEN_KEY = 'jwt_token';

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private http: HttpClient) {
    const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
    if (storedToken) {
      this.tokenSubject.next(storedToken);
      this.loadCurrentUser();
    }
  }

  public get token(): string | null {
    return this.tokenSubject.value;
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/current-user`, {
      withCredentials: true
    }).pipe(
      map(response => response.data),
      tap(user => this.currentUserSubject.next(user))
    );
  }
}

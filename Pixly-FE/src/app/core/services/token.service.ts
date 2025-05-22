import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private readonly TOKEN_KEY = 'jwt_token';

  constructor() {
    const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
  }
}

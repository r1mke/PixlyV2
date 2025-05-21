import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string | null = null;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  setToken(token: string): void {
    this.token = token;
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.token;
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  clearToken(): void {
    this.token = null;
    this.tokenSubject.next(null);
  }

  hasToken(): boolean {
    return !!this.token;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthState } from '../state/auth.state';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authState: AuthState,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authState.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}

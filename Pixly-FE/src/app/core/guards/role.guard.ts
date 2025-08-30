import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../state/auth.state';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { RouterStateSnapshot } from '@angular/router';
export interface RoleConfig {
  roles?: string[];           // Potrebne uloge (OR logika)
  requireAll?: boolean;       // Da li treba SVE uloge (AND logika)
  allowAnonymous?: boolean;   // Da li anonimni korisnici mogu pristupiti
  redirectTo?: string;        // Custom redirect umesto /unauthorized
}
@Injectable({
  providedIn: 'root'
})


export class RoleGuard implements CanActivate {

   constructor(
    private authService: AuthService,
    private authState: AuthState,
    private router: Router
  ) { }


   canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> {
    const config: RoleConfig = {
      roles: [],
      requireAll: false,
      allowAnonymous: false,
      redirectTo: '/unauthorized',
      ...route.data 
    };

    if (config.allowAnonymous) {
      return of(true);
    }

    return this.authService.initializeAuthIfNeeded().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
          return of(false);
        }

      
        if (!config.roles || config.roles.length === 0) {
          return of(true);
        }

        const currentUser = this.authState.currentUser;
        const userRoles = currentUser?.roles || [];
        let hasAccess = false;

        if (config.requireAll) {
          
          hasAccess = config.roles.every(role => userRoles.includes(role));
        } else {
    
          hasAccess = config.roles.some(role => userRoles.includes(role));
        }
        
        if (!hasAccess) {
          this.router.navigate([config.redirectTo]);
          return of(false);
        }

        return of(true);
      })
    );
  }
}

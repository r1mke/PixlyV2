import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SearchGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const title = route.paramMap.get('title');
    if (!title) {
      // Pravilno preusmjeravanje koje čisti i query parametre
      return this.router.createUrlTree(['/'], { queryParams: {}, queryParamsHandling: '' });
    }
    return true;
  }
}


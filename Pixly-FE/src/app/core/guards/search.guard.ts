import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SearchGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const title = route.paramMap.get('title');
    console.log('title', title);
    if (!title || title.trim().length === 0) {
      return this.router.createUrlTree(['/'],
         { queryParams: {}, queryParamsHandling: '' });
    }
    return true;
  }
}


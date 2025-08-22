import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptorFn: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  
  const excludedRoutes = [
    'api.openai.com',
    'assets/',
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif'
  ];

   const shouldExclude = excludedRoutes.some(route => 
    req.url.includes(route)
  );
  
  if (shouldExclude) {
    return next(req);
  }

  loadingService.addRequest();
  
  return next(req).pipe(
    finalize(() => {
      loadingService.removeRequest();
    })
  );
};

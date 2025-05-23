import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptorFn: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.addRequest();

  return next(req).pipe(
    finalize(() => {
      loadingService.removeRequest();
    })
  );
};

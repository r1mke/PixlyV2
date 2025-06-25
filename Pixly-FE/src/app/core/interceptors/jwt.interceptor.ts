import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from '../state/auth.state';

export const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const token = authState.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

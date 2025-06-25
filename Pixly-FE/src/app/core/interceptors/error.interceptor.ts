import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {ToastService} from '../services/toast.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  const isInitialAuthRequest = req.url.includes('/refresh-token') ||
    req.url.includes('/current-user');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      let showToast = true;

      if (error.status === 401 && isInitialAuthRequest) {
        showToast = false;
      }

      if (error && showToast) {
        if (error.error && error.error.success === true && error.error.token) {
          return throwError(() => error);
        }

        switch (error.status) {
          case 400:
            if (error.error?.errors?.length) {
              errorMessage = error.error.errors.join(', ');
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Bad request';
            }
            break;

          case 401:
            errorMessage = error.error?.message || 'Unauthorized access';
            break;

          case 403:
            errorMessage = error.error?.message || 'Access forbidden';
            break;

          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;

          case 409:
            errorMessage = error.error?.message || 'Conflict occurred';
            break;

          case 429:
            errorMessage = error.error?.message || 'Too many requests, please try again later';
            break;

          case 500:
            errorMessage = error.error?.message || 'Server error. Please try again later';
            break;


          default:
            errorMessage = error.error?.message || 'An unexpected error occurred';
            break;
        }

        toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};




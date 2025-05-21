import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { errorInterceptorFn } from './core/interceptors/error.interceptor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import {jwtInterceptorFn} from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),

    provideHttpClient(
      withFetch(),
      withInterceptors([
        jwtInterceptorFn,
        errorInterceptorFn,
      ])
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]
};

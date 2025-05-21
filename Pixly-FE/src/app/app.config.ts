import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ import this
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { errorInterceptorFn, jwtInterceptorFn } from './core/interceptors/interceptor-provider';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptorFn, errorInterceptorFn])
    )
  ]
};

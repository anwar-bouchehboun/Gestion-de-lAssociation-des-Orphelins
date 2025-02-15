import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './interceptor/request.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { activiteReducer } from './store/activite/activite.reducer';
import { ActiviteEffects } from './store/activite/activite.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideStore({ activite: activiteReducer }),
    provideEffects([ActiviteEffects]),
  ],
};

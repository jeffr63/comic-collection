import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { CustomTitleStrategy } from './shared/services/common/custom-title-strategy';
import { APP_ROUTES } from './app-routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    provideRouter(APP_ROUTES, withComponentInputBinding()),
  ],
};

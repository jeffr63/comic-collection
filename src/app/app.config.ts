import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { CustomTitleStrategy } from './shared/services/common/custom-title-strategy';
import { APP_ROUTES } from './app-routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    provideRouter(APP_ROUTES, withComponentInputBinding()),
  ],
};

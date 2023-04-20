import { ApplicationConfig } from '@angular/core';
import { CustomTitleStrategyService } from './shared/resolvers/custom-title-strategy.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    provideRouter(APP_ROUTES),
  ],
};

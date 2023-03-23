import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';

import { environment } from './environments/environment';
import { APP_ROUTES } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CustomTitleStrategyService } from './app/services/custom-title-strategy.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    provideRouter(APP_ROUTES),
  ],
}).catch((err) => console.error(err));

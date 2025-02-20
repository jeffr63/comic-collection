import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthDataService } from './shared/services/auth-data.service';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, RouterOutlet],
  template: `
    <app-menu />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  readonly #authStore = inject(AuthDataService);

  ngOnInit() {
    this.#authStore.checkLogin();
  }
}

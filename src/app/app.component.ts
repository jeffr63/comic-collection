import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthFacade } from './shared/facades/auth.facade';
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
    styles: []
})
export class AppComponent implements OnInit {
  readonly #authStore = inject(AuthFacade);

  ngOnInit() {
    this.#authStore.checkLogin();
  }
}

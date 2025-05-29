import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './shared/services/auth/auth-service';
import { Menu } from './menu/menu';

@Component({
  selector: 'app-root',
  imports: [Menu, RouterOutlet],
  template: `
    <app-menu />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class App implements OnInit {
  readonly #authStore = inject(AuthService);

  ngOnInit() {
    this.#authStore.checkLogin();
  }
}

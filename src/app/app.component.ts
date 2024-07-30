import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthStore } from './shared/store/auth.store';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
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
  readonly #authStore = inject(AuthStore);

  ngOnInit() {
    this.#authStore.checkLogin();
  }
}

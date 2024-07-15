import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './shared/services/auth.service';
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
  readonly #authService = inject(AuthService);

  ngOnInit() {
    this.#authService.checkLogin();
  }
}

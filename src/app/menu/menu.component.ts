import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { take } from 'rxjs';

import { AuthDataService } from '../shared/services/auth/auth-data.service';
import { LoginComponent } from '../shared/modals/login.component';
import { MenuToolbarComponent } from './menu-toolbar.component';

@Component({
  selector: 'app-menu',
  imports: [MenuToolbarComponent],
  template: `
    <app-menu-toolbar
      [isLoggedIn]="isLoggedIn()"
      [isLoggedInAsAdmin]="isLoggedInAsAdmin()"
      (login)="login()"
      (logout)="logout()" />
  `,
})
export class MenuComponent {
  readonly #authStore = inject(AuthDataService);
  readonly #dialog = inject(MatDialog);
  readonly #router = inject(Router);

  dialogRef!: MatDialogRef<LoginComponent, { email: string; password: string }>;
  isLoggedIn = this.#authStore.isLoggedIn;
  isLoggedInAsAdmin = this.#authStore.isLoggedInAsAdmin;
  isNavbarCollapsed = true;
  email = '';
  password = '';

  login() {
    this.dialogRef = this.#dialog.open(LoginComponent, {
      width: '500px',
      data: { email: this.email, password: this.password },
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          if (result) {
            this.#authStore.login(result.email, result.password);
          }
        },
      });
  }

  logout() {
    this.#authStore.logout();
    this.#router.navigate(['/']);
  }
}

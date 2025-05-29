import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth/auth-service';
import { LoginModal } from '../shared/modals/login-modal';
import { MenuToolbar } from './menu-toolbar';

@Component({
  selector: 'app-menu',
  imports: [MenuToolbar],
  template: `
    <app-menu-toolbar
      [isLoggedIn]="isLoggedIn()"
      [isLoggedInAsAdmin]="isLoggedInAsAdmin()"
      (login)="login()"
      (logout)="logout()" />
  `,
})
export class Menu {
  readonly #authStore = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #router = inject(Router);

  dialogRef!: MatDialogRef<LoginModal, { email: string; password: string }>;
  isLoggedIn = this.#authStore.isLoggedIn;
  isLoggedInAsAdmin = this.#authStore.isLoggedInAsAdmin;
  isNavbarCollapsed = true;
  email = '';
  password = '';

  login() {
    this.dialogRef = this.#dialog.open(LoginModal, {
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

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { AuthFacade } from '../shared/facades/auth.facade';
import { LoginComponent } from '../shared/modals/login.component';

@Component({
    selector: 'app-menu',
    imports: [MatDialogModule, MatIconModule, MatToolbarModule, MatButtonModule, RouterLink],
    template: `
    <mat-toolbar color="primary">
      <button mat-flat-button color="primary" routerLink="/">
        <span style="font-size:20px">Comic Collection</span>
      </button>
      <span style="flex: 1 1 auto"></span>
      <button mat-flat-button color="primary" routerLink="/" id="home">Home</button>
      <button mat-flat-button color="primary" routerLink="/by_publisher" id="by_publishers">By Publisher</button>
      <button mat-flat-button color="primary" routerLink="/by_title" id="by_titles">By Title</button>
      <button mat-flat-button color="primary" routerLink="/issues" id="courses">All Issues</button>
      <!-- show login button if logged out -->
      @if (!isLoggedIn()) {
      <button mat-flat-button color="primary" (click)="login()" id="login">Login</button>
      }
      <!-- show admin button if logged in as admin -->
      @if (isLoggedInAsAdmin()) {
      <button mat-flat-button color="primary" routerLink="/admin" id="admin">Admin</button>
      }
      <!-- show logout button if logged in -->
      @if (isLoggedIn()) {
      <button mat-flat-button color="primary" (click)="logout()" id="logout">Logout</button>
      }
    </mat-toolbar>
  `,
    styles: [
        `
      div .nav-item {
        cursor: pointer;
      }
    `,
    ]
})
export class MenuComponent {
  readonly #authStore = inject(AuthFacade);
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

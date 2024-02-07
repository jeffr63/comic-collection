import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { Observable, take } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { LoginComponent } from '../shared/modals/login.component';

@Component({
  selector: 'app-menu',
  standalone: true,
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
      @if (!isLoggedIn()) {
      <button mat-flat-button color="primary" (click)="login()" id="login">Login</button>
      } @if (isLoggedInAsAdmin()) {
      <button mat-flat-button color="primary" routerLink="/admin" id="admin">Admin</button>
      } @if (isLoggedIn()) {
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
  ],
})
export class MenuComponent {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  dialogRef!: MatDialogRef<LoginComponent, { email: string; password: string }>;
  isLoggedIn = this.authService.isLoggedIn;
  isLoggedInAsAdmin = this.authService.isLoggedInAsAdmin;
  isNavbarCollapsed = true;
  email = '';
  password = '';

  login() {
    this.dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      data: { email: this.email, password: this.password },
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          if (result) {
            this.authService.login(result.email, result.password);
          }
        },
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

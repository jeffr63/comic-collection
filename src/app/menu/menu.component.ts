import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLinkWithHref } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../modals/login.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    NgIf,
    RouterLinkWithHref,
  ],

  template: `
    <mat-toolbar color="primary">
      <a mat-button class="primary" [routerLink]="['/']" id="brand">
        <h3 class="text-white">Comic Collection</h3>
      </a>
      <span style="flex: 1 1 auto;"></span>
      <a mat-button class="primary" [routerLink]="['/']" id="home">Home</a>
      <a
        mat-button
        class="primary"
        [routerLink]="['/by_publishers']"
        id="by_publishers"
        >By Publisher</a
      >
      <a mat-button class="primary" [routerLink]="['/by_titles']" id="by_titles"
        >By Title</a
      >
      <a mat-button class="primary" [routerLink]="['/issues']" id="courses"
        >All Issues</a
      >
      <button
        mat-button
        class="primary"
        *ngIf="auth.isAuthenticated === false"
        (click)="open()"
        id="login"
      >
        Login
      </button>
      <a
        mat-button
        class="primary"
        [routerLink]="['/admin']"
        *ngIf="auth.isAuthenticated && auth.isAdmin"
        id="admin"
      >
        Admin
      </a>
      <button
        mat-button
        class="primary"
        *ngIf="auth.isAuthenticated"
        (click)="logout()"
        id="logout"
      >
        Logout
      </button>
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
  public isNavbarCollapsed = true;
  email = '';
  password = '';

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  open() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      data: { email: this.email, password: this.password },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.auth
            .login(result.email, result.password)
            .pipe(take(1))
            .subscribe();
        },
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

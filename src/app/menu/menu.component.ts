import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { LoginComponent } from '../shared/modals/login.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatToolbarModule, MatButtonModule, NgIf, RouterLink],

  template: `
    <mat-toolbar color="primary">
      <button mat-flat-button color="primary" [routerLink]="['/']">
        <span style="font-size:20px">Comic Collection</span>
      </button>
      <span style="flex: 1 1 auto"></span>
      <button mat-flat-button color="primary" [routerLink]="['/']" id="home">Home</button>
      <button mat-flat-button color="primary" [routerLink]="['/by_publisher']" id="by_publishers">By Publisher</button>
      <button mat-flat-button color="primary" [routerLink]="['/by_title']" id="by_titles">By Title</button>
      <button mat-flat-button color="primary" [routerLink]="['/issues']" id="courses">All Issues</button>
      <button mat-flat-button color="primary" *ngIf="!auth.isAuthenticated()" (click)="open()" id="login">Login</button>
      <button mat-flat-button color="primary" [routerLink]="['/admin']" *ngIf="auth.isLoggedInAsAdmin()" id="admin">
        Admin
      </button>
      <button mat-flat-button color="primary" *ngIf="auth.isAuthenticated()" (click)="logout()" id="logout">
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
  public auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  public isNavbarCollapsed = true;
  email = '';
  password = '';

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
          this.auth.login(result.email, result.password);
        },
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

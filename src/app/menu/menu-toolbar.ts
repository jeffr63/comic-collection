import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-toolbar',
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
        <button mat-flat-button color="primary" (click)="login.emit()" id="login">Login</button>
      }
      <!-- show admin button if logged in as admin -->
      @if (isLoggedInAsAdmin()) {
        <button mat-flat-button color="primary" routerLink="/admin" id="admin">Admin</button>
      }
      <!-- show logout button if logged in -->
      @if (isLoggedIn()) {
        <button mat-flat-button color="primary" (click)="logout.emit()" id="logout">Logout</button>
      }
    </mat-toolbar>
  `,
  styles: `
    div .nav-item {
      cursor: pointer;
    }
  `,
})
export class MenuToolbar {
  isLoggedIn = input(false);
  isLoggedInAsAdmin = input(false);
  login = output();
  logout = output();
}

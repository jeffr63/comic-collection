import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    RouterLinkWithHref,
  ],

  template: `
    <section>
      <div class="header">
        <h1 class="mat-display-2">Administration</h1>
      </div>

      <mat-grid-list cols="3">
        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Publishers</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>
                Pre-selections for the Publisher field on Issue and Title edit
                forms.
              </p>
              <a
                mat-flat-button
                color="primary"
                class="center"
                [routerLink]="['/admin/publishers']"
                >Edit Publishers</a
              >
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Titles</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="card-text">
                Pre-selections for the Title field on Issue edit form.
              </p>
              <a
                mat-flat-button
                color="primary"
                [routerLink]="['/admin/titles']"
                >Edit Title</a
              >
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Users</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="card-text">Current users.</p>
              <a mat-flat-button color="primary" [routerLink]="['/admin/users']"
                >Edit Users</a
              >
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [
    `
      mat-card {
        width: 80%;
        margin: 0 auto;
      }
      .center {
        text-align: center;
      }

      section {
        margin: 10px;
      }
    `,
  ],
})
export class AdminComponent {
  constructor(router: Router) {}
}

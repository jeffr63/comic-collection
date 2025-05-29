import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatButtonModule, MatGridListModule, MatCardModule],
  template: `
    <section>
      <div class="header">
        <h1 class="mat-display-2">Administration</h1>
      </div>

      <mat-grid-list cols="3">
        @for(card of cards; track card) {
        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">{{ card.title }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ card.content }}</p>
              <button mat-flat-button color="primary" class="center" (click)="redirectTo(card.redirectTo)">
                {{ card.buttonLabel }}
              </button>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        }
      </mat-grid-list>
    </section>
  `,
  styles: [
    `
      mat-card {
        width: 80%;
        margin: 0 auto;
      }
      section {
        margin: 10px;
      }
    `,
  ],
})
export default class AdminComponent {
  readonly #router = inject(Router);

  cards = [
    {
      title: 'Publishers',
      content: 'Pre-selections for the Publisher field on Issue and Title edit forms.',
      buttonLabel: 'Edit Publishers',
      redirectTo: 'publishers',
    },
    {
      title: 'Titles',
      content: 'Pre-selections for the Title field on Issue edit form.',
      buttonLabel: 'Edit Titles',
      redirectTo: 'titles',
    },
    {
      title: 'Users',
      content: 'Current users',
      buttonLabel: 'Edit Users',
      redirectTo: 'users',
    },
  ];

  redirectTo(link: string) {
    this.#router.navigate([`/admin/${link}`]);
  }
}

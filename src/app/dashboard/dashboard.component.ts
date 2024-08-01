import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { IssueFacade } from '../shared/facades/issue.facade';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, NgxChartsModule],

  template: `
    <section>
      <mat-grid-list cols="2">
        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Issues by Publisher</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="publishers()"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5">
              </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Issues by Title</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="titles()"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5">
              </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [],
})
export class DashboardComponent implements OnInit {
  readonly #issueStore = inject(IssueFacade);

  issues = this.#issueStore.issues;
  publishers = this.#issueStore.publishers;
  titles = this.#issueStore.titles;

  async ngOnInit() {
    if (this.issues().length === 0) {
      await this.#issueStore.getAll();
    }
  }
}

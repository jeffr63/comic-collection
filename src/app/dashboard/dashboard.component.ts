import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { IssueService } from '../shared/services/issue.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

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
              <ngx-charts-pie-chart [view]="[400, 400]" [results]="publishers()" [labels]="true" [doughnut]="true" [arcWidth]="0.5"> </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Issues by Title</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart [view]="[400, 400]" [results]="titles()" [labels]="true" [doughnut]="true" [arcWidth]="0.5"> </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [],
})
export class DashboardComponent implements OnInit {
  readonly #issueService = inject(IssueService);

  protected readonly issues = this.#issueService.issues;
  protected readonly publishers = this.#issueService.publishers;
  protected readonly titles = this.#issueService.titles;

  async ngOnInit() {
    if (this.issues().length === 0) {
      await this.#issueService.getAll();
    }
  }
}

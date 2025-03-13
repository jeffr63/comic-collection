import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { IssueData } from '../models/issue';

@Component({
  selector: 'app-chart-card',
  imports: [MatCardModule, NgxChartsModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title color="primary">{{title()}}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <ngx-charts-pie-chart
          [view]="[400, 400]"
          [results]="data()"
          [labels]="true"
          [doughnut]="true"
          [arcWidth]="0.5">
        </ngx-charts-pie-chart>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class ChartCardComponent {
  data = input.required<IssueData[]>();
  title = input<string>('');
}

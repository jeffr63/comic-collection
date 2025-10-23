import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatGridListModule } from '@angular/material/grid-list';

import { ChartCard } from '../shared/components/chart-card';
import { IssueChartData } from '../shared/models/issue-interface';

@Component({
  selector: 'app-dashboard-content',
  imports: [MatGridListModule, ChartCard],
  template: `
    <section>
      <mat-grid-list cols="2">
        <mat-grid-tile>
          <app-chart-card [data]="publishers()" title="Issues by Publisher" />
        </mat-grid-tile>

        <mat-grid-tile>
          <app-chart-card [data]="titles()" title="Issues by Title" />
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContent {
  publishers = input.required<IssueChartData[]>();
  titles = input.required<IssueChartData[]>();
}

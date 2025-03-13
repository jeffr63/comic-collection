import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

import { ChartCardComponent } from '../shared/components/chart-card.component';
import { IssueData } from '../shared/models/issue';

@Component({
  selector: 'app-dashboard-content',
  imports: [MatGridListModule, ChartCardComponent],
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
  styles: ``,
})
export class DashboardContentComponent {
  publishers = input.required<IssueData[]>();
  titles = input.required<IssueData[]>();
}

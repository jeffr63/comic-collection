import { Component, inject, OnInit, signal } from '@angular/core';

import * as _ from 'lodash';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Issue, IssueData } from '../shared/models/issue';
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
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="publishers()"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
              >
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
                [arcWidth]="0.5"
              >
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
  issueService = inject(IssueService);

  issues = this.issueService.issues;
  publishers = signal<IssueData[]>([]);
  titles = signal<IssueData[]>([]);

  async ngOnInit() {
    if (this.issues().length === 0) {
      await this.issueService.getAll();
    }
    this.publishers.set(this.getByPublisherValue(this.issues()));
    this.titles.set(this.getByTitleValue(this.issues()));
  }

  getByPublisherValue(issues: Issue[]): IssueData[] {
    let byPublisher = _.chain(issues)
      .groupBy('publisher')
      .map((values, key) => {
        return {
          name: key,
          value: _.reduce(
            values,
            function (value, number) {
              return value + 1;
            },
            0
          ),
        };
      })
      .value();
    byPublisher = _.orderBy(byPublisher, 'value', 'desc');
    return byPublisher;
  }

  getByTitleValue(issues: Issue[]): IssueData[] {
    let byTitle = _.chain(issues)
      .groupBy('title')
      .map((values, key) => {
        return {
          name: key,
          value: _.reduce(
            values,
            function (value, number) {
              return value + 1;
            },
            0
          ),
        };
      })
      .value();
    byTitle = _.orderBy(byTitle, 'value', 'desc');
    return byTitle;
  }
}

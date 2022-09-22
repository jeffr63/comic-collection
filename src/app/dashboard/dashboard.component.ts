import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, of, Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Issue, IssueData } from '../models/issue';
import { IssueService } from '../issues/issue.service';
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
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Issues by Publisher</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="publishers$ | async"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
              >
              </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Issues by Title</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="titles$ | async"
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
export class DashboardComponent implements OnInit, OnDestroy {
	publishers$!: Observable<IssueData[]>;
  titles$!: Observable<IssueData[]>;
  componentIsDestroyed = new Subject<boolean>();

  constructor(private issueService: IssueService) {}

  ngOnInit() {
       this.issueService
         .getAll()
         .pipe(takeUntil(this.componentIsDestroyed))
         .subscribe((issues: Issue[]) => {
           this.publishers$ = this.getByPublisherValue(issues);
           this.titles$ = this.getByTitleValue(issues);
         });
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

    getByPublisherValue(issues: Issue[]): Observable<IssueData[]> {
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
    return of(byPublisher);
  }

  getByTitleValue(issues: Issue[]): Observable<IssueData[]> {
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
    return of(byTitle);
  }
}

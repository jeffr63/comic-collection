import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { IssueService } from '../issues/issue.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],

  template: ` <section></section> `,

  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  componentIsDestroyed = new Subject<boolean>();

  constructor(private issueService: IssueService) {}

  ngOnInit() {
    //   this.courseService
    //     .getAll()
    //     .pipe(takeUntil(this.componentIsDestroyed))
    //     .subscribe((courses: Course[]) => {
    //       this.courses$ = this.getByPathValue(courses);
    //       this.sources$ = this.getBySourceValue(courses);
    //     });
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }
}

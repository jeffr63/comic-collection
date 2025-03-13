import { Component, inject } from '@angular/core';

import { DashboardContentComponent } from './dashboard-content.component';
import { IssueDataService } from '../shared/services/issue/issue-data.service';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardContentComponent],
  template: `<app-dashboard-content [publishers]="publishers()" [titles]="titles()" />`,
})
export class DashboardComponent {
  readonly #issueStore = inject(IssueDataService);

  issues = this.#issueStore.issues;
  publishers = this.#issueStore.publishers;
  titles = this.#issueStore.titles;
}

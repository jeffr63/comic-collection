import { Component, inject } from '@angular/core';

import { DashboardContent } from './dashboard-content';
import { IssueData } from '../shared/services/issue/issue-data';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardContent],
  template: `<app-dashboard-content [publishers]="publishers()" [titles]="titles()" />`,
})
export class Dashboard {
  readonly #issueStore = inject(IssueData);

  issues = this.#issueStore.issues;
  publishers = this.#issueStore.publishers;
  titles = this.#issueStore.titles;
}

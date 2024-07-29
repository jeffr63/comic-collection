import { computed, Injectable, signal } from '@angular/core';
import { Issue, IssueData } from '../models/issue';

@Injectable({
  providedIn: 'root',
})
export class IssueStore {
  readonly #issues = signal<Issue[]>([]);

  public readonly issues = this.#issues.asReadonly();
  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues()));
  public readonly titles = computed(() => this.getByTitleValue(this.#issues()));

  public setIssues(value: Issue[]) {
    this.#issues.set(value);
  }

  private getByPublisherValue(issues: Issue[]): IssueData[] {
    let byPublisher: IssueData[] = [];
    issues.reduce((res, issue) => {
      if (!res[issue.publisher]) {
        res[issue.publisher] = { name: issue.publisher, value: 0 };
        byPublisher.push(res[issue.publisher]);
      }
      res[issue.publisher].value += 1;
      return res;
    }, {});
    byPublisher.sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });
    return byPublisher;
  }

  private getByTitleValue(issues: Issue[]): IssueData[] {
    let byTitle: IssueData[] = [];
    issues.reduce((res, issue) => {
      if (!res[issue.title]) {
        res[issue.title] = { name: issue.title, value: 0 };
        byTitle.push(res[issue.title]);
      }
      res[issue.title].value += 1;
      return res;
    }, {});
    byTitle.sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });
    return byTitle;
  }
}

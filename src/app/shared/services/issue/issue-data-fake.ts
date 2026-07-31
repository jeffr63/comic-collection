import { computed, EnvironmentProviders, Injectable, makeEnvironmentProviders, signal } from '@angular/core';

import { Issue, IssueChartData } from '../../models/issue-interface';
import { IssueData } from './issue-data';
import { Public } from '../common/public';

@Injectable()
export class IssueDataFake implements Public<IssueData> {
  readonly #issues = signal<Issue[]>([]);

  configure({ issues }: { issues: Issue[] }) {
    this.#issues.set(issues);
  }

  public readonly issues = this.#issues.asReadonly();

  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues()));

  public readonly titles = computed(() => this.getByTitleValue(this.#issues()));

  public async add(issue: Issue): Promise<Issue | undefined> {
    this.#issues.update((issues) => [...issues, issue]);
    return issue;
  }

  public async delete(id: number) {
    this.#issues.update((issues) => issues.filter((i) => i.id !== id));
  }

  public async getById(id: number): Promise<Issue | undefined> {
    const issue = this.#issues().find((issue) => issue.id === id);
    return await issue;
  }

  public async search(term: string): Promise<Issue[]> {
    return this.#issues();
  }

  public async update(issue: Issue): Promise<Issue | undefined> {
    this.#issues.update((issues) => issues.map((i) => (i.id === issue.id ? issue : i)));
    return issue;
  }

  public getByPublisherValue(issues: Issue[]): IssueChartData[] {
    let byPublisher: IssueChartData[] = [];

    if (!issues) return byPublisher;

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

  public getByTitleValue(issues: Issue[]): IssueChartData[] {
    let byTitle: IssueChartData[] = [];

    if (!issues) return byTitle;

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

export function provideIssueDataFake(): EnvironmentProviders {
  return makeEnvironmentProviders([IssueDataFake, { provide: IssueData, useExisting: IssueDataFake }]);
}

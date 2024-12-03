import { computed, inject, Injectable, resource, signal } from '@angular/core';

import { Issue, IssueData } from '../models/issue';
import { IssueService } from '../services/issue.service';

@Injectable({
  providedIn: 'root',
})
export class IssueFacade {
  readonly #issueService = inject(IssueService);

  readonly #issues = resource({
    loader: async () => await this.#issueService.getAll(),
  });

  public readonly issues = computed(() => this.#issues.value());
  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues.value()));
  public readonly titles = computed(() => this.getByTitleValue(this.#issues.value()));

  public async add(issue: Issue): Promise<Issue | undefined> {
    const newIssue = await this.#issueService.add(issue);
    this.#issues.reload();
    return newIssue;
  }

  public async delete(id: number) {
    await this.#issueService.delete(id);
    this.#issues.reload();
  }

  public async getById(id: number): Promise<Issue | undefined> {
    return await this.#issueService.getById(id);
  }

  public async search(term: string): Promise<Issue[]> {
     return await this.#issueService.search(term);
  }

  public async update(issue: Issue): Promise<Issue | undefined> {
    const response = await this.#issueService.update(issue);
    this.#issues.reload();
    return response;
  }

  public getByPublisherValue(issues: Issue[]): IssueData[] {
    let byPublisher: IssueData[] = [];

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

  public getByTitleValue(issues: Issue[]): IssueData[] {
    let byTitle: IssueData[] = [];

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

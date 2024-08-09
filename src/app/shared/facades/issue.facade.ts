import { computed, inject, Injectable, signal } from '@angular/core';

import { describe, expect, test } from '@jest/globals';

import { Issue, IssueData } from '../models/issue';
import { IssueService } from '../services/issue.service';

@Injectable({
  providedIn: 'root',
})
export class IssueFacade {
  readonly #issueService = inject(IssueService);

  readonly #issues = signal<Issue[]>([]);

  public readonly issues = this.#issues.asReadonly();
  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues()));
  public readonly titles = computed(() => this.getByTitleValue(this.#issues()));

  public async add(issue: Issue): Promise<Issue | undefined> {
    const newIssue = await this.#issueService.add(issue);
    await this.getAll();
    return newIssue;
  }

  public async delete(id: number) {
    this.#issueService.delete(id);
    await this.getAll();
  }

  public async getAll() {
    const response = await this.#issueService.getAll();
    this.#issues.set(response);
  }

  public async getById(id: number): Promise<Issue | undefined> {
    return await this.#issueService.getById(id);
  }

  public async search(term: string): Promise<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]) ?? [];
    }

    return await this.#issueService.search(term);
  }

  public async update(issue: Issue): Promise<Issue | undefined> {
    const response = await this.#issueService.update(issue);
    await this.getAll();
    return response;
  }

  public getByPublisherValue(issues: Issue[]): IssueData[] {
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

  public getByTitleValue(issues: Issue[]): IssueData[] {
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

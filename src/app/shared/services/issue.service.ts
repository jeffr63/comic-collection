import { Injectable, computed, signal } from '@angular/core';

import { Issue, IssueData } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService {
  readonly #issuesUrl = 'http://localhost:3000/issues';
  readonly #issues = signal<Issue[]>([]);
  public readonly issues = this.#issues.asReadonly();
  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues()));
  public readonly titles = computed(() => this.getByTitleValue(this.#issues()));

  public async add(issue: Issue): Promise<Issue | undefined> {
    const response = await fetch(this.#issuesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    await this.getAll();
    const newIssue = (await response.json()) ?? {};
    return newIssue;
  }

  public async delete(id: number) {
    const url = `${this.#issuesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    await this.getAll();
  }

  public async getAll() {
    const response = await fetch(this.#issuesUrl);
    this.#issues.set(await response.json());
  }

  public async getById(id: number): Promise<Issue | undefined> {
    const url = `${this.#issuesUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  private async search(term: string): Promise<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]) ?? [];
    }

    const response = await fetch(`${this.#issuesUrl}?${term}`);
    return (await response.json()) ?? [];
  }

  public async update(issue: Issue): Promise<Issue | undefined> {
    const response = await fetch(`${this.#issuesUrl}/${issue.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    await this.getAll();
    return (await response.json()) ?? {};
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

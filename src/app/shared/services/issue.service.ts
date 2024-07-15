import { Injectable, computed, signal } from '@angular/core';

import { orderBy, chain, reduce } from 'lodash';

import { Issue, IssueData } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService {
  readonly #issuesUrl = 'http://localhost:3000/issues';
  readonly #issues = signal<Issue[]>([]);
  public readonly issues = this.#issues.asReadonly();
  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues()));
  public readonly titles = computed(() => this.getByTitleValue(this.#issues()));

  public async add(issue: Issue): Promise<Issue> {
    const response = await fetch(this.#issuesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    await this.getAll();
    const newIssue = (await response.json()) as unknown as Issue;
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

  public async getById(id: number): Promise<any> {
    const url = `${this.#issuesUrl}/${id}`;
    const response = await fetch(url);
    return await response.json();
  }

  private async search(term: string): Promise<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const response = await fetch(`${this.#issuesUrl}?${term}`);
    return (await response.json()) as unknown as Issue[];
  }

  public async update(issue: Issue): Promise<any> {
    const response = await fetch(`${this.#issuesUrl}/${issue.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    await this.getAll();
    return await response.json();
  }

  private getByPublisherValue(issues: Issue[]): IssueData[] {
    let byPublisher = chain(issues)
      .groupBy('publisher')
      .map((values, key) => {
        return {
          name: key,
          value: reduce(
            values,
            function (value, number) {
              return value + 1;
            },
            0
          ),
        };
      })
      .value();
    byPublisher = orderBy(byPublisher, 'value', 'desc');
    return byPublisher;
  }

  private getByTitleValue(issues: Issue[]): IssueData[] {
    let byTitle = chain(issues)
      .groupBy('title')
      .map((values, key) => {
        return {
          name: key,
          value: reduce(
            values,
            function (value, number) {
              return value + 1;
            },
            0
          ),
        };
      })
      .value();
    byTitle = orderBy(byTitle, 'value', 'desc');
    return byTitle;
  }
}

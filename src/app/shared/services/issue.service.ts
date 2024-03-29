import { Injectable, computed, signal } from '@angular/core';

import { orderBy, chain, reduce } from 'lodash';

import { Issue, IssueData } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService {
  #issuesUrl = 'http://localhost:3000/issues';
  #issues = signal<Issue[]>([]);
  issues = this.#issues.asReadonly();
  publishers = computed(() => this.getByPublisherValue(this.#issues()));
  titles = computed(() => this.getByTitleValue(this.#issues()));

  async add(issue: Issue): Promise<Issue> {
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

  async delete(id: number) {
    const url = `${this.#issuesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    await this.getAll();
  }

  async getAll() {
    const response = await fetch(this.#issuesUrl);
    this.#issues.set(await response.json());
  }

  async getById(id: number): Promise<any> {
    const url = `${this.#issuesUrl}/${id}`;
    const response = await fetch(url);
    return await response.json();
  }

  async search(term: string): Promise<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const response = await fetch(`${this.#issuesUrl}?${term}`);
    return (await response.json()) as unknown as Issue[];
  }

  async update(issue: Issue): Promise<any> {
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

  getByPublisherValue(issues: Issue[]): IssueData[] {
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

  getByTitleValue(issues: Issue[]): IssueData[] {
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

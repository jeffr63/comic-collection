import { Injectable, inject } from '@angular/core';

import { Issue, IssueData } from '../models/issue';
import { IssueStore } from '../store/issue.store';

@Injectable({ providedIn: 'root' })
export class IssueService {
  readonly #issueStore = inject(IssueStore);

  readonly #issuesUrl = 'http://localhost:3000/issues';

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
    this.#issueStore.setIssues(await response.json());
  }

  public async getById(id: number): Promise<Issue | undefined> {
    const url = `${this.#issuesUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  public async search(term: string): Promise<Issue[]> {
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
}

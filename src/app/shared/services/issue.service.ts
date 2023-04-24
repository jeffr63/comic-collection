import { Injectable, computed, signal } from '@angular/core';

import { Issue } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService {
  #issuesUrl = 'http://localhost:3000/issues';
  #issues = signal<Issue[]>([]);
  issues = computed(this.#issues);

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
}

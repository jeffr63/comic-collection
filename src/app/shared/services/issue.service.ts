import { Injectable } from '@angular/core';

import { Issue } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService {
  readonly #issuesUrl = 'http://localhost:3000/issues';

  public async add(issue: Issue): Promise<Issue | undefined> {
    const response = await fetch(this.#issuesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });

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
  }

  public async getAll(): Promise<Issue[]> {
    const response = await fetch(this.#issuesUrl);
    return await response.json();
  }

  public async getById(id: number): Promise<Issue | undefined> {
    const url = `${this.#issuesUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  public async search(term: string): Promise<Issue[]> {
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
    return (await response.json()) ?? {};
  }
}

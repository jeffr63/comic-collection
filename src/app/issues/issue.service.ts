import { Injectable } from '@angular/core';

import { Issue } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService {
  issuesUrl = 'http://localhost:3000/issues';

  async add(issue: Issue): Promise<Issue> {
    const response = await fetch(this.issuesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    const newIssue = (await response.json()) as unknown as Issue;

    return newIssue;
  }

  async delete(id: number) {
    const url = `${this.issuesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  async getAll() {
    const response = await fetch(this.issuesUrl);
    return await response.json();
  }

  async getById(id: number): Promise<any> {
    const url = `${this.issuesUrl}/${id}`;
    const response = await fetch(url);
    return await response.json();
  }

  async search(term: string): Promise<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const response = await fetch(`${this.issuesUrl}?${term}`);
    return (await response.json()) as unknown as Issue[];
  }

  async update(issue: Issue): Promise<any> {
    const response = await fetch(`${this.issuesUrl}/${issue.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    return await response.json();
  }
}

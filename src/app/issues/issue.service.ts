import { Injectable } from '@angular/core';

import { Issue } from '../models/issue';

@Injectable({ providedIn: "root" })
export class IssueService {
  issuesUrl = "http://localhost:3000/publishers";

  async add(issue: Issue): Promise<Issue> {
    const response = await fetch(this.issuesUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(issue),
    });
    const newIssue = response.json() as unknown as Issue;

    return newIssue;
  }

  async delete(id: number): Promise<void> {
    const url = `${this.issuesUrl}/${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  }

  async getAll() {
    const response = await fetch(this.issuesUrl);
    return response.json();
  }

  async getById(id: number): Promise<any> {
    const url = `${this.issuesUrl}/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  async search(term: string): Promise<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    return fetch(`${this.issuesUrl}?${term}`).then((res) => {
      return res.json() as unknown as Issue[];
    });
  }

  async update(issue: Issue): Promise<any> {
    await fetch(`${this.issuesUrl}/${issue.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(issue),
    });
  }
}

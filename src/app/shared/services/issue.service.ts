import { inject, Injectable } from '@angular/core';

import { Issue } from '../models/issue';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class IssueService {
  #dataService = inject(DataService);

  readonly #issuesUrl = 'http://localhost:3000/issues';

  public async add(issue: Issue): Promise<Issue | undefined> {
    return await this.#dataService.add<Issue>(issue, this.#issuesUrl);
  }

  public async delete(id: number) {
    await this.#dataService.delete(id, this.#issuesUrl);
  }

  public async getAll(): Promise<Issue[]> {
    const issues = this.#dataService.getAll<Issue[]>(this.#issuesUrl);
    return issues;
  }

  public async getById(id: number): Promise<Issue | undefined> {
    return await this.#dataService.getById<Issue>(id, this.#issuesUrl);
  }

  public async search(term: string): Promise<Issue[]> {
    return await this.#dataService.search<Issue[]>(term, this.#issuesUrl);
  }

  public async update(issue: Issue): Promise<Issue | undefined> {
    return await this.#dataService.update<Issue>(issue.id, issue, this.#issuesUrl);
  }
}

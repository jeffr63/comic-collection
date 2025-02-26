import { computed, inject, Injectable, resource } from '@angular/core';

import { DataService } from '../common/data.service';
import { Issue, IssueData } from '../../models/issue';

@Injectable({
  providedIn: 'root',
})
export class IssueDataService {
  readonly #dataService = inject(DataService);

  readonly #issuesUrl = 'http://localhost:3000/issues';

  readonly #issues = resource({
    loader: async () => await this.#dataService.getAll<Issue[]>(this.#issuesUrl),
  });

  public readonly issues = this.#issues.value.asReadonly();

  public readonly publishers = computed(() => this.getByPublisherValue(this.#issues.value()));

  public readonly titles = computed(() => this.getByTitleValue(this.#issues.value()));

  public async add(issue: Issue): Promise<Issue | undefined> {
    const newIssue = await this.#dataService.add<Issue>(issue, this.#issuesUrl);
    this.#issues.reload();
    return newIssue;
  }

  public async delete(id: number) {
    await this.#dataService.delete(id, this.#issuesUrl);
    this.#issues.reload();
  }

  public async getById(id: number): Promise<Issue | undefined> {
    return await this.#dataService.getById<Issue>(id, this.#issuesUrl);
  }

  public async search(term: string): Promise<Issue[]> {
    return await this.#dataService.search<Issue[]>(term, this.#issuesUrl);
  }

  public async update(issue: Issue): Promise<Issue | undefined> {
    const response = await this.#dataService.update<Issue>(issue.id, issue, this.#issuesUrl);
    this.#issues.reload();
    return response;
  }

  public getByPublisherValue(issues: Issue[]): IssueData[] {
    let byPublisher: IssueData[] = [];

    if (!issues) return byPublisher;

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

    if (!issues) return byTitle;

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

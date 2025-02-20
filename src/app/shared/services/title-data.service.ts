import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Title } from '../models/title';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class TitleDataService {
  //readonly #titleService = inject(TitleService);
  readonly #dataService = inject(DataService);

  readonly #titlesUrl = 'http://localhost:3000/titles';
  readonly #titles = resource({
    loader: async () => await this.#dataService.getAll<Title[]>(this.#titlesUrl),
  });
  sortedTitles = computed(() => {
    let sorted = this.#titles.value();
    if (!sorted || sorted.length === 0) return [];
    sorted.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    return sorted;
  });
  public readonly titles = computed(() => this.#titles.value());

  public async add(title: Title): Promise<Title | undefined> {
    const newTitle = await this.#dataService.add<Title>(title, this.#titlesUrl);
    this.#titles.reload();
    return newTitle;
  }

  public async delete(id: number) {
    await this.#dataService.delete(id, this.#titlesUrl);
    this.#titles.reload();
  }

  public async getById(id: number): Promise<Title | undefined> {
    return await this.#dataService.getById<Title>(id, this.#titlesUrl);
  }

  public async search(term: string): Promise<Title[]> {
    return await this.#dataService.search<Title[]>(term, this.#titlesUrl);
  }

  public async update(title: Title): Promise<Title | undefined> {
    const response = await this.#dataService.update<Title>(title.id, title, this.#titlesUrl);
    this.#titles.reload();
    return response;
  }
}

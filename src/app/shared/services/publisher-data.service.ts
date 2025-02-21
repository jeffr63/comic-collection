import { computed, inject, Injectable, resource, signal } from '@angular/core';

import { DataService } from './data.service';
import { Publisher } from '../models/publisher';

@Injectable({
  providedIn: 'root',
})
export class PublisherDataService {
  readonly #dataService = inject(DataService);

  #publishersUrl = 'http://localhost:3000/publishers';

  #publishers = resource({
    loader: async () => await this.#dataService.getAll<Publisher[]>(this.#publishersUrl),
  });

  public readonly publishers = this.#publishers.value.asReadonly();

  sortedPublishers = computed(() => {
    let sorted = this.#publishers.value();
    if (!sorted || sorted.length === 0) return [];
    sorted.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return sorted;
  });

  public async add(publisher: Publisher): Promise<Publisher | undefined> {
    const newTitle = await this.#dataService.add<Publisher>(publisher, this.#publishersUrl);
    this.#publishers.reload();
    return newTitle;
  }

  public async delete(id: number) {
    await this.#dataService.delete(id, this.#publishersUrl);
    this.#publishers.reload();
  }

  public async getById(id: number): Promise<Publisher | undefined> {
    return await this.#dataService.getById<Publisher>(id, this.#publishersUrl);
  }

  public async search(term: string): Promise<Publisher[]> {
    return await this.#dataService.search<Publisher[]>(term, this.#publishersUrl);
  }

  public async update(publisher: Publisher): Promise<Publisher | undefined> {
    const response = await this.#dataService.update(publisher.id, publisher, this.#publishersUrl);
    this.#publishers.reload();
    return response;
  }
}

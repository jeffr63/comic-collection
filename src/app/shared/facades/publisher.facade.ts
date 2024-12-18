import { computed, inject, Injectable, resource, signal } from '@angular/core';

import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';

@Injectable({
  providedIn: 'root',
})
export class PublisherFacade {
  readonly #publisherService = inject(PublisherService);

  #publishers = resource({
    loader: async () => await this.#publisherService.getAll(),
  });

  public readonly publishers = computed(() => this.#publishers.value());
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
    const newTitle = await this.#publisherService.add(publisher);
    this.#publishers.reload();
    return newTitle;
  }

  public async delete(id: number) {
    await this.#publisherService.delete(id);
    this.#publishers.reload();
  }

  public async getById(id: number): Promise<Publisher | undefined> {
    return await this.#publisherService.getById(id);
  }

  public async search(term: string): Promise<Publisher[]> {
    return await this.#publisherService.search(term);
  }

  public async update(publisher: Publisher): Promise<Publisher | undefined> {
    const response = await this.#publisherService.update(publisher);
    this.#publishers.reload();
    return response;
  }
}

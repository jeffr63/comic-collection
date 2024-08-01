import { inject, Injectable, signal } from '@angular/core';

import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';

@Injectable({
  providedIn: 'root',
})
export class PublisherFacade {
  readonly #publisherService = inject(PublisherService);

  #publishers = signal<Publisher[]>([]);

  public readonly publishers = this.#publishers.asReadonly();

  public async add(publisher: Publisher): Promise<Publisher | undefined> {
    const newTitle = await this.#publisherService.add(publisher);
    await this.getAll();
    return newTitle;
  }

  public async delete(id: number) {
    await this.#publisherService.delete(id);
    await this.getAll();
  }

  public async getAll() {
    const response = await this.#publisherService.getAll();
    this.#publishers.set(response);
  }

  public async getById(id: number): Promise<Publisher | undefined> {
    return await this.#publisherService.getById(id);
  }

  public async search(term: string): Promise<Publisher[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]) ?? [];
    }

    return await this.#publisherService.search(term);
  }

  public async update(publisher: Publisher): Promise<Publisher | undefined> {
    const response = await this.#publisherService.update(publisher);
    await this.getAll();
    return response;
  }
}

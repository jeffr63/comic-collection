import { inject, Injectable } from '@angular/core';

import { Publisher } from '../models/publisher';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class PublisherService {
  #dataService = inject(DataService);

  #publishersUrl = 'http://localhost:3000/publishers';

  public async add(publisher: Publisher): Promise<Publisher | undefined> {
    return await this.#dataService.add<Publisher>(publisher, this.#publishersUrl);
  }

  public async delete(id: number) {
    await this.#dataService.delete(id, this.#publishersUrl);
  }

  public async getAll(): Promise<Publisher[]> {
    return await this.#dataService.getAll<Publisher[]>(this.#publishersUrl);
  }

  public async getById(id: number): Promise<Publisher | undefined> {
    return await this.#dataService.getById<Publisher>(id, this.#publishersUrl);
  }

  public async search(term: string): Promise<Publisher[]> {
    return await this.#dataService.search<Publisher[]>(term, this.#publishersUrl);
  }

  public async update(publisher: Publisher): Promise<Publisher | undefined> {
    return await this.#dataService.update(publisher.id, publisher, this.#publishersUrl);
  }
}

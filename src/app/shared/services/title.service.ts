import { inject, Injectable } from '@angular/core';

import { Title } from '../models/title';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class TitleService {
  #dataService = inject(DataService);

  readonly #titlesUrl = 'http://localhost:3000/titles';

  public async add(title: Title): Promise<Title | undefined> {
    return await this.#dataService.add<Title>(title, this.#titlesUrl);
  }

  public async delete(id: number) {
    await this.#dataService.delete(id, this.#titlesUrl);
  }

  public async getAll(): Promise<Title[]> {
    return await this.#dataService.getAll<Title[]>(this.#titlesUrl);
  }

  public async getById(id: number): Promise<Title | undefined> {
    return await this.#dataService.getById<Title>(id, this.#titlesUrl);
  }

  public async search(term: string): Promise<Title[]> {
    return await this.#dataService.search<Title[]>(term, this.#titlesUrl);
  }

  public async update(title: Title): Promise<Title | undefined> {
    return await this.#dataService.update<Title>(title.id, title, this.#titlesUrl);
  }
}

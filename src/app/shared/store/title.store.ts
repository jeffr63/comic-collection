import { inject, Injectable, signal } from '@angular/core';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';

@Injectable({
  providedIn: 'root',
})
export class TitleStore {
  readonly #titleService = inject(TitleService);

  readonly #titles = signal<Title[]>([]);

  public readonly titles = this.#titles.asReadonly();

  public async add(title: Title): Promise<Title | undefined> {
    const newTitle = await this.#titleService.add(title);
    await this.getAll();
    return newTitle;
  }

  public async delete(id: number) {
    await this.#titleService.delete(id);
    await this.getAll();
  }

  public async getAll() {
    const response = await this.#titleService.getAll();
    this.#titles.set(response);
  }

  public async getById(id: number): Promise<Title | undefined> {
    return await this.#titleService.getById(id);
  }

  private async search(term: string): Promise<Title[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }
    return (await this.#titleService.search(term));
  }

  public async update(title: Title): Promise<Title | undefined> {
    const response = this.#titleService.update(title);
    await this.getAll();
    return response;
  }
}

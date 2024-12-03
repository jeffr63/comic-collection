import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';

@Injectable({
  providedIn: 'root',
})
export class TitleFacade {
  readonly #titleService = inject(TitleService);

  readonly #titles = resource({
    loader: async () => await this.#titleService.getAll(),
  });

  public readonly titles = computed(() => this.#titles.value());

  public async add(title: Title): Promise<Title | undefined> {
    const newTitle = await this.#titleService.add(title);
    this.#titles.reload();
    return newTitle;
  }

  public async delete(id: number) {
    await this.#titleService.delete(id);
    this.#titles.reload();
  }

  public async getById(id: number): Promise<Title | undefined> {
    return await this.#titleService.getById(id);
  }

  public async search(term: string): Promise<Title[]> {
    return await this.#titleService.search(term);
  }

  public async update(title: Title): Promise<Title | undefined> {
    const response = this.#titleService.update(title);
    this.#titles.reload();
    return response;
  }
}

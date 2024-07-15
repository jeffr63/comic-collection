import { Injectable, computed, signal } from '@angular/core';

import { Title } from '../models/title';

@Injectable({ providedIn: 'root' })
export class TitleService {
  readonly #titlesUrl = 'http://localhost:3000/titles';
  readonly #titles = signal<Title[]>([]);
  public readonly titles = this.#titles.asReadonly();

  public async add(title: Title): Promise<Title | undefined> {
    const response = await fetch(this.#titlesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(title),
    });
    await this.getAll();
    const newTitle = (await response.json()) ?? {};
    return newTitle;
  }

  public async delete(id: number) {
    const url = `${this.#titlesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    await this.getAll();
  }

  public async getAll() {
    const response = await fetch(this.#titlesUrl);
    this.#titles.set(await response.json());
  }

  public async getById(id: number): Promise<Title | undefined> {
    const url = `${this.#titlesUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  private async search(term: string): Promise<Title[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const response = await fetch(`${this.#titlesUrl}?${term}`);
    return (await response.json()) ?? [];
  }

  public async update(title: Title): Promise<Title | undefined> {
    const user = await fetch(`${this.#titlesUrl}/${title.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(title),
    });
    await this.getAll();
    return (await user.json()) ?? {};
  }
}

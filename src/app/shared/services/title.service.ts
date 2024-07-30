import { Injectable } from '@angular/core';

import { Title } from '../models/title';

@Injectable({ providedIn: 'root' })
export class TitleService {
  readonly #titlesUrl = 'http://localhost:3000/titles';

  public async add(title: Title): Promise<Title | undefined> {
    const response = await fetch(this.#titlesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(title),
    });
    return (await response.json()) ?? {};
  }

  public async delete(id: number) {
    const url = `${this.#titlesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  public async getAll(): Promise<Title[]> {
    const response = await fetch(this.#titlesUrl);
    return (await response.json()) ?? [];
  }

  public async getById(id: number): Promise<Title | undefined> {
    const url = `${this.#titlesUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  public async search(term: string): Promise<Title[]> {
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
    return (await user.json()) ?? {};
  }
}

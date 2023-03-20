import { Injectable } from '@angular/core';

import { Title } from '../models/title';

@Injectable({ providedIn: 'root' })
export class TitleService {
  titlesUrl = 'http://localhost:3000/titles';

  async add(title: Title): Promise<Title> {
    const response = await fetch(this.titlesUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(title),
    });
    const newTitle = (await response.json()) as unknown as Title;

    return newTitle;
  }

  async delete(id: number) {
    const url = `${this.titlesUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  async getAll() {
    const response = await fetch(this.titlesUrl);
    return await response.json();
  }

  async getById(id: number): Promise<any> {
    const url = `${this.titlesUrl}/${id}`;
    const response = await fetch(url);
    return await response.json();
  }

  async search(term: string): Promise<Title[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const response = await fetch(`${this.titlesUrl}?${term}`);
    return (await response.json()) as unknown as Title[];
  }

  async update(title: Title): Promise<any> {
    const user = await fetch(`${this.titlesUrl}/${title.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(title),
    });
    return await user.json();
  }
}

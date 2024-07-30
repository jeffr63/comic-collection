import { Injectable } from '@angular/core';

import { Publisher } from '../models/publisher';

@Injectable({ providedIn: 'root' })
export class PublisherService {
  #publishersUrl = 'http://localhost:3000/publishers';

  public async add(publisher: Publisher): Promise<Publisher | undefined> {
    const response = await fetch(this.#publishersUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(publisher),
    });
    const newTitle = (await response.json()) ?? undefined;
    return newTitle;
  }

  public async delete(id: number) {
    const url = `${this.#publishersUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  public async getAll(): Promise<Publisher[]> {
    const response = await fetch(this.#publishersUrl);
    return await response.json();
  }

  public async getById(id: number): Promise<Publisher | undefined> {
    const url = `${this.#publishersUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  public async search(term: string): Promise<Publisher[]> {
    const response = await fetch(`${this.#publishersUrl}?${term}`);
    return (await response.json()) ?? [];
  }

  public async update(publisher: Publisher): Promise<Publisher | undefined> {
    const response = await fetch(`${this.#publishersUrl}/${publisher.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(publisher),
    });
    return (await response.json()) ?? {};
  }
}

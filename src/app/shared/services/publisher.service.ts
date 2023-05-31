import { Injectable, computed, signal } from '@angular/core';

import { Publisher } from '../models/publisher';

@Injectable({ providedIn: 'root' })
export class PublisherService {
  #publishersUrl = 'http://localhost:3000/publishers';
  #publishers = signal<Publisher[]>([]);
  publishers = this.#publishers.asReadonly();

  async add(publisher: Publisher): Promise<Publisher> {
    const response = await fetch(this.#publishersUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(publisher),
    });
    await this.getAll();
    const newTitle = (await response.json()) as unknown as Publisher;
    return newTitle;
  }

  async delete(id: number) {
    const url = `${this.#publishersUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    await this.getAll();
  }

  async getAll() {
    const response = await fetch(this.#publishersUrl);
    this.#publishers.set(await response.json());
  }

  async getById(id: number): Promise<any> {
    const url = `${this.#publishersUrl}/${id}`;
    const response = await fetch(url);
    return await response.json();
  }

  async search(term: string): Promise<Publisher[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const response = await fetch(`${this.#publishersUrl}?${term}`);
    return (await response.json()) as unknown as Publisher[];
  }

  async update(publisher: Publisher): Promise<any> {
    const response = await fetch(`${this.#publishersUrl}/${publisher.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(publisher),
    });
    await this.getAll();
    return await response.json();
  }
}

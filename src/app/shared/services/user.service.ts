import { Injectable, signal } from '@angular/core';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly #usersUrl = 'http://localhost:3000/users';
  readonly #users = signal<User[]>([]);
  public readonly users = this.#users.asReadonly();

  public async add(user: User): Promise<User | undefined> {
    const response = await fetch(this.#usersUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    await this.getAll();
    const newUser = (await response.json()) ?? {};
    return newUser;
  }

  public async delete(id: number): Promise<void> {
    const url = `${this.#usersUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    await this.getAll();
  }

  public async getAll() {
    const response = await fetch(this.#usersUrl);
    this.#users.set(await response.json());
  }

  public async getById(id: number): Promise<User | undefined> {
    if (!id) {
      return Promise.resolve({} as User);
    }
    const url = `${this.#usersUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  private async search(term: string): Promise<User[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const user = await fetch(`${this.#usersUrl}?${term}`);
    return (await user.json()) ?? [];
  }

  public async update(user: User): Promise<User | undefined> {
    const response = await fetch(`${this.#usersUrl}/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    await this.getAll();
    return (await response.json()) ?? {};
  }
}

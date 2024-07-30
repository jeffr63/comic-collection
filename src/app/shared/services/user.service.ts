import { Injectable } from '@angular/core';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly #usersUrl = 'http://localhost:3000/users';

  public async add(user: User): Promise<User | undefined> {
    const response = await fetch(this.#usersUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
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
  }

  public async getAll(): Promise<User[]> {
    const response = await fetch(this.#usersUrl);
    return (await response.json()) ?? [];
  }

  public async getById(id: number): Promise<User | undefined> {
    if (!id) {
      return Promise.resolve({} as User);
    }
    const url = `${this.#usersUrl}/${id}`;
    const response = await fetch(url);
    return (await response.json()) ?? {};
  }

  public async search(term: string): Promise<User[]> {
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
    return (await response.json()) ?? {};
  }
}

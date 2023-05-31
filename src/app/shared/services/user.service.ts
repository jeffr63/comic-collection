import { Injectable, computed, signal } from '@angular/core';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  #usersUrl = 'http://localhost:3000/users';
  #users = signal<User[]>([]);
  users = this.#users.asReadonly();

  async add(user: User): Promise<User> {
    const response = await fetch(this.#usersUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    await this.getAll();
    const newUser = (await response.json()) as unknown as User;
    return newUser;
  }

  async delete(id: number): Promise<void> {
    const url = `${this.#usersUrl}/${id}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    await this.getAll();
  }

  async getAll() {
    const response = await fetch(this.#usersUrl);
    this.#users.set(await response.json());
  }

  async getById(id: number): Promise<any> {
    if (!id) return {};
    const url = `${this.#usersUrl}/${id}`;
    const response = await fetch(url);
    return await response.json();
  }

  async search(term: string): Promise<User[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    const user = await fetch(`${this.#usersUrl}?${term}`);
    return (await user.json()) as unknown as User[];
  }

  async update(user: User): Promise<any> {
    const response = await fetch(`${this.#usersUrl}/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    await this.getAll();
    return await response.json();
  }
}

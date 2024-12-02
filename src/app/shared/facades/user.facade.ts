import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  readonly #userService = inject(UserService);

  readonly #users = signal<User[]>([]);

  public readonly users = this.#users.asReadonly();

  public async add(user: User): Promise<User | undefined> {
    const newUser = await this.#userService.add(user);
    await this.getAll();
    return newUser;
  }

  public async delete(id: number): Promise<void> {
    if (!id) {
      return;
    }
    await this.#userService.delete(id);
    await this.getAll();
  }

  public async getAll() {
    const response = await this.#userService.getAll();
    this.#users.set(response);
  }

  public async getById(id: number): Promise<User | undefined> {
    if (!id) {
      return Promise.resolve({} as User);
    }
    return await this.#userService.getById(id);
  }

  public async search(term: string): Promise<User[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }
    return await this.#userService.search(term);
  }

  public async update(user: User): Promise<User | undefined> {
    const response = await this.#userService.update(user);
    await this.getAll();
    return response;
  }
}

import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  readonly #userService = inject(UserService);

  readonly #users = resource({
    loader: async () => await this.#userService.getAll(),
  });

  public readonly users = computed(() => this.#users.value());

  public async add(user: User): Promise<User | undefined> {
    const newUser = await this.#userService.add(user);
    this.#users.reload();
    return newUser;
  }

  public async delete(id: number): Promise<void> {
    await this.#userService.delete(id);
    this.#users.reload();
  }

  public async getById(id: number): Promise<User | undefined> {
    return await this.#userService.getById(id);
  }

  public async search(term: string): Promise<User[]> {
    return await this.#userService.search(term);
  }

  public async update(user: User): Promise<User | undefined> {
    const response = await this.#userService.update(user);
    this.#users.reload();
    return response;
  }
}

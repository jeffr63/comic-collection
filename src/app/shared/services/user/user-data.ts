import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { User } from '../../models/user-interface';
import { DataService } from '../common/data-service';

@Injectable({
  providedIn: 'root',
})
export class UserData {
  readonly #dataService = inject(DataService);

  readonly #usersUrl = 'http://localhost:3000/users';

  readonly #users = resource({
    loader: async () => await this.#dataService.getAll<User[]>(this.#usersUrl),
  });

  public readonly users = this.#users.value.asReadonly();

  public async add(user: User): Promise<User | undefined> {
    const newUser = await this.#dataService.add<User>(user, this.#usersUrl);
    this.#users.reload();
    return newUser;
  }

  public async delete(id: number): Promise<void> {
    await this.#dataService.delete(id, this.#usersUrl);
    this.#users.reload();
  }

  public async getById(id: number): Promise<User | undefined> {
    return await this.#dataService.getById(id, this.#usersUrl);
  }

  public async search(term: string): Promise<User[]> {
    return await this.#dataService.search<User[]>(term, this.#usersUrl);
  }

  public async update(user: User): Promise<User | undefined> {
    const response = await this.#dataService.update<User>(user.id, user, this.#usersUrl);
    this.#users.reload();
    return response;
  }
}

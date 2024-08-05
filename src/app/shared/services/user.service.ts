import { inject, Injectable } from '@angular/core';

import { User } from '../models/user';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  #dataService = inject(DataService);

  readonly #usersUrl = 'http://localhost:3000/users';

  public async add(user: User): Promise<User | undefined> {
    return this.#dataService.add<User>(user, this.#usersUrl);
  }

  public async delete(id: number): Promise<void> {
    this.#dataService.delete(id, this.#usersUrl);
  }

  public async getAll(): Promise<User[]> {
    return this.#dataService.getAll<User[]>(this.#usersUrl);
  }

  public async getById(id: number): Promise<User | undefined> {
    return this.#dataService.getById(id, this.#usersUrl);
  }

  public async search(term: string): Promise<User[]> {
    return this.#dataService.search<User[]>(term, this.#usersUrl);
  }

  public async update(user: User): Promise<User | undefined> {
    return this.#dataService.update<User>(user.id, user, this.#usersUrl);
  }
}

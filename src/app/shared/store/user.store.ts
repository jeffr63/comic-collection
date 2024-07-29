import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  readonly #users = signal<User[]>([]);

  public readonly users = this.#users.asReadonly();

  public setUsers(value: User[]) {
    this.#users.set(value);
  }
}

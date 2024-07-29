import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  readonly #isAdmin = signal(false);
  readonly #isLoggedIn = signal(false);
  public readonly isLoggedIn = this.#isLoggedIn.asReadonly();
  public readonly isLoggedInAsAdmin = computed(() => this.#isLoggedIn() && this.#isAdmin());

  public setIsAdmin(value: boolean) {
    this.#isAdmin.set(value);
  }

  public setIsLoggedIn(value: boolean) {
    this.#isLoggedIn.set(value);
  }
}

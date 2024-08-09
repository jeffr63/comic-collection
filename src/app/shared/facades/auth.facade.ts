import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthToken } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  readonly #authService = inject(AuthService);

  readonly #isAdmin = signal(false);
  readonly #isLoggedIn = signal(false);
  public readonly isLoggedIn = this.#isLoggedIn.asReadonly();
  public readonly isLoggedInAsAdmin = computed(() => this.#isLoggedIn() && this.#isAdmin());

  public async login(email: string, password: string) {
    const response = await this.#authService.login(email, password);

    // login successful if there's a jwt token in the response and if that token is valid
    if (response && response.accessToken) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      const token = this.parseJwt(response.accessToken);
      const auth: AuthToken = {
        token: response.accessToken,
        role: response.user.role,
        id: response.user.id,
        expires: token.exp,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      this.#isLoggedIn.set(true);
      this.#isAdmin.set(response.user.role === 'admin' ? true : false);
    }
    return response;
  }

  public logout(): void {
    localStorage.removeItem('tct_auth');
    this.#isLoggedIn.set(false);
    this.#isAdmin.set(false);
  }

  public checkLogin() {
    const tct_auth = localStorage.getItem('tct_auth');
    if (!tct_auth) return;

    let auth: AuthToken = JSON.parse(tct_auth);
    if (!auth) return;

    let now = Date.now() / 1000;
    if (auth.expires > now) {
      this.#isLoggedIn.set(true);
      this.#isAdmin.set(auth.role === 'admin' ? true : false);
      // !!letting token expire after jwt expires
      // keep logged in for another hour
      // auth.expires = auth.expires + 3600;
      // localStorage.setItem('tct_auth', JSON.stringify(auth));
    } else {
      this.logout();
    }
  }

  public parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}

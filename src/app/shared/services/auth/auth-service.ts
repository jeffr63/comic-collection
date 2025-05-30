import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthToken } from '../../models/auth-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #isAdmin = signal(false);

  readonly #isLoggedIn = signal(false);

  public readonly isLoggedIn = this.#isLoggedIn.asReadonly();

  public readonly isLoggedInAsAdmin = computed(() => this.#isLoggedIn() && this.#isAdmin());

  public async login(email: string, password: string) {
    const response = await this.userLogin(email, password);

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

  public async userLogin(email: string, password: string) {
    const body = JSON.stringify({ email: email, password: password });
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: body,
    });
    return await res.json();
  }
}

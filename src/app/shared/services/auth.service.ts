import { Injectable, computed, signal } from '@angular/core';

class AuthToken {
  token: string = '';
  role: string = '';
  id: number = 0;
  expires: number = 0;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #isAdmin = signal(false);
  #isLoggedIn = signal(false);
  isLoggedIn = this.#isLoggedIn.asReadonly();
  isLoggedInAsAdmin = computed(() => this.#isLoggedIn() && this.#isAdmin());

  async login(email: string, password: string) {
    const body = JSON.stringify({ email: email, password: password });
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: body,
    });
    const response = await res.json();

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

  logout(): void {
    localStorage.removeItem('tct_auth');
    this.#isLoggedIn.set(false);
    this.#isAdmin.set(false);
  }

  checkLogin() {
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

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}

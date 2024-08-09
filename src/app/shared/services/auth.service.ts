import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public async login(email: string, password: string) {
    const body = JSON.stringify({ email: email, password: password });
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: body,
    });
    const response = await res.json();
    console.log(response);
    return await res.json();
  }
}

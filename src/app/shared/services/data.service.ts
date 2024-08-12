import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  public async add<T>(data: T, url: string): Promise<T | undefined> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) ?? {};
    } catch (e) {
      return <T>{};
    }
  }

  public async delete(id: number, url: string) {
    await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  public async getAll<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      return (await response.json()) ?? [];
    } catch (e) {
      return <T>[];
    }
  }

  public async getById<T>(id: number, url: string): Promise<T | undefined> {
    try {
      const response = await fetch(`${url}/${id}`);
      return (await response.json()) ?? {};
    } catch (e) {
      return <T>{};
    }
  }

  public async search<T>(term: string, url: string): Promise<T> {
    try {
      const response = await fetch(`${url}?${term}`);
      return (await response.json()) ?? [];
    } catch (e) {
      return <T>[];
    }
  }

  public async update<T>(id: number, data: T, url: string): Promise<T | undefined> {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return (await response.json()) ?? {};
    } catch (e) {
      return <T>{};
    }

  }
}

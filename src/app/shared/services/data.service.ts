import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  public async add<T>(data: T, url: string): Promise<T> {
    if (!data || !url) {
      return <T>{};
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) ?? <T>{};
    } catch (e) {
      return <T>{};
    }
  }

  public async delete(id: number, url: string) {
    if (!id || !url) {
      return;
    }

    await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  public async getAll<T>(url: string): Promise<T> {
    if (!url) {
      return <T>[];
    }

    try {
      const response = await fetch(url);
      return (await response.json()) ?? <T>[];
    } catch (e) {
      return <T>[];
    }
  }

  public async getById<T>(id: number, url: string): Promise<T> {
    if (!id || !url) {
      return <T>{};
    }

    try {
      const response = await fetch(`${url}/${id}`);
      return (await response.json()) ?? <T>{};
    } catch (e) {
      return <T>{};
    }
  }

  public async search<T>(term: string, url: string): Promise<T> {
    if (!term || !url) {
      return <T>[];
    }

    try {
      const response = await fetch(`${url}?${term}`);
      return (await response.json()) ?? <T>[];
    } catch (e) {
      return <T>[];
    }
  }

  public async update<T>(id: number, data: T, url: string): Promise<T> {
    if (!id || !data || !url) {
      return <T>{};
    }

    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return (await response.json()) ?? <T>{};
    } catch (e) {
      return <T>{};
    }
  }
}

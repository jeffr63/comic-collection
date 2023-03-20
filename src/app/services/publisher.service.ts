import { Injectable } from "@angular/core";

import { Publisher } from "../models/publisher";

@Injectable({ providedIn: "root" })
export class PublisherService {
  publushersUrl = "http://localhost:3000/publishers";

  async add(publisher: Publisher): Promise<Publisher> {
    const response = await fetch(this.publushersUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(publisher),
    });
    const newTitle = response.json() as unknown as Publisher;

    return newTitle;
  }

  async delete(id: number): Promise<void> {
    const url = `${this.publushersUrl}/${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  }

  async getAll() {
    const response = await fetch(this.publushersUrl);
    return response.json();
  }

  async getById(id: number): Promise<any> {
    const url = `${this.publushersUrl}/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  async search(term: string): Promise<Publisher[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    return fetch(`${this.publushersUrl}?${term}`).then((res) => {
      return res.json() as unknown as Publisher[];
    });
  }

  async update(publisher: Publisher): Promise<any> {
    await fetch(`${this.publushersUrl}/${publisher.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(publisher),
    });
  }
}

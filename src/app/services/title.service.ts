import { Injectable } from "@angular/core";

import { Title } from "../models/title";

@Injectable({ providedIn: "root" })
export class TitleService {
  titlesUrl = "http://localhost:3000/titles";

  async add(title: Title): Promise<Title> {
    const response = await fetch(this.titlesUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(title),
    });
    const newTitle = response.json() as unknown as Title;

    return newTitle;
  }

  async delete(id: number): Promise<void> {
    const url = `${this.titlesUrl}/${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  }

  async getAll() {
    const response = await fetch(this.titlesUrl);
    return response.json();
  }

  async getById(id: number): Promise<any> {
    const url = `${this.titlesUrl}/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  async search(term: string): Promise<Title[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return Promise.resolve([]);
    }

    return fetch(`${this.titlesUrl}?${term}`).then((res) => {
      return res.json() as unknown as Title[];
    });
  }

  async update(title: Title): Promise<any> {
    await fetch(`${this.titlesUrl}/${title.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(title),
    });
  }
}

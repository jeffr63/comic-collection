import { Injectable, signal } from '@angular/core';
import { Title } from '../models/title';

@Injectable({
  providedIn: 'root',
})
export class TitleStore {
  readonly #titles = signal<Title[]>([]);

  public readonly titles = this.#titles.asReadonly();

  public setTitles(value: Title[]) {
    this.#titles.set(value);
  }
}

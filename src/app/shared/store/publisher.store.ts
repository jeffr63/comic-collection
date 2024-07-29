import { computed, Injectable, signal } from '@angular/core';
import { Publisher } from '../models/publisher';

@Injectable({
  providedIn: 'root',
})
export class PublisherStore {
  #publishers = signal<Publisher[]>([]);

  public readonly publishers = this.#publishers.asReadonly();

  public setPublishers(value: Publisher[]) {
    this.#publishers.set(value);
  }
}
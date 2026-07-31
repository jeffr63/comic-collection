import { Injectable, EnvironmentProviders, makeEnvironmentProviders, signal } from '@angular/core';

import { DataService } from './data-service';

@Injectable()
export class DataServiceFake implements DataService {
  #data = [];

  configure<T>(data: T) {
    this.#data = data as any;
  }

  public async add<T>(data: T, url: string): Promise<T> {
    return await data;
  }

  public async delete(id: number, url: string) {
    this.#data = this.#data.filter((i) => i.id !== id);
    return;
  }

  public async getAll<T>(url: string): Promise<T> {
    return await (<T>this.#data);
  }

  public async getById<T>(id: number, url: string): Promise<T> {
    const data = this.#data.find((d) => (d.id = id));
    return await (<T>data);
  }

  public async search<T>(term: string, url: string): Promise<T> {
    if (term === '') {
      return <T>[];
    }
    return await (<T>this.#data);
  }

  public async update<T>(id: number, data: T, url: string): Promise<T> {
    this.#data = this.#data.map((i) => (i.id === id ? data : i));
    return await (<T>data);
  }
}

export function provideDataServiceFake(): EnvironmentProviders {
  return makeEnvironmentProviders([DataServiceFake, { provide: DataService, useExisting: DataServiceFake }]);
}

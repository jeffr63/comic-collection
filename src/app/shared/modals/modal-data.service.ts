import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalDataService {
  #deleteModalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  setDeleteModalOptions(options: any) {
    this.#deleteModalOptions = options;
  }

  getDeleteModalOptions(): any {
    return this.#deleteModalOptions;
  }
}

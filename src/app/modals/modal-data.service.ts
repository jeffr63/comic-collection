import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalDataService {
  private deleteModalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  constructor() {}

  setDeleteModalOptions(options: any) {
    this.deleteModalOptions = options;
  }

  getDeleteModalOtions(): any {
    return this.deleteModalOptions;
  }
}

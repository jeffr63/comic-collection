import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService extends EntityCollectionServiceBase<User> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, private http: HttpClient) {
    super('Users', serviceElementsFactory);
  }

  patch(id: number, data: any) {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.patch<any>(`http://localhost:3000/users/${id}`, data, { headers: httpHeaders });
  }
}

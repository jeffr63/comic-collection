import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Publisher } from '../models/publisher';

@Injectable({ providedIn: 'root' })
export class PublisherService extends EntityCollectionServiceBase<Publisher> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Publishers', serviceElementsFactory);
  }
}

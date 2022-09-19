import { Injectable } from '@angular/core';

import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { Title } from '../models/title';

@Injectable({ providedIn: 'root' })
export class TitleService extends EntityCollectionServiceBase<Title> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Titles', serviceElementsFactory);
  }
}

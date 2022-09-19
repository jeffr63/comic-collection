import { Injectable } from '@angular/core';

import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { Issue } from '../models/issue';

@Injectable({ providedIn: 'root' })
export class IssueService extends EntityCollectionServiceBase<Issue> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Issues', serviceElementsFactory);
  }
}

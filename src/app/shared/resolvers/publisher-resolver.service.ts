import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { PublisherDataService } from '../services/publisher-data.service';

export const publisherNameResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Publisher';
  } else {
    const publisher = await inject(PublisherDataService).getById(Number(id));
    return publisher.name;
  }
};

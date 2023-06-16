import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { PublisherService } from '../services/publisher.service';

export const publisherNameResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Publisher';
  } else {
    const publisher = await inject(PublisherService).getById(Number(id));
    return publisher.name;
  }
};

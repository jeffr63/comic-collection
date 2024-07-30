import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { PublisherStore } from '../store/publisher.store';

export const publisherNameResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Publisher';
  } else {
    const publisher = await inject(PublisherStore).getById(Number(id));
    return publisher.name;
  }
};

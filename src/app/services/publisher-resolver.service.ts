import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { PublisherService } from './publisher.service';

@Injectable({
  providedIn: 'root',
})
export class PublisherResolverService {
  publisherService = inject(PublisherService);

  async resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Publisher';
    } else {
      const publisher = await this.publisherService.getById(Number(id));
      return publisher.name;
    }
  }
}

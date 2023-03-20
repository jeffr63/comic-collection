import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { PublisherService } from '../services/publisher.service';

@Injectable({
  providedIn: 'root',
})
export class ByPublisherResolverService {
  publisherService = inject(PublisherService);

  async resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    const publisher = await this.publisherService.getById(Number(id));
    return publisher.name;
  }
}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { PublisherService } from '../services/publisher.service';

@Injectable({
  providedIn: 'root',
})
export class ByPublisherResolverService implements Resolve<string> {
  constructor(private publisherService: PublisherService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    return this.publisherService
      .getByKey(id)
      .pipe(map((publisher) => publisher.name));
  }
}

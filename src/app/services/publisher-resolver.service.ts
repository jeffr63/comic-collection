import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

import { PublisherService } from './publisher.service';

@Injectable({
  providedIn: 'root',
})
export class PublisherResolverService implements Resolve<string> {
  private sub = new Subscription();

  constructor(private publisherService: PublisherService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Publisher';
    } else {
      return this.publisherService.getByKey(id).pipe(map((path) => path.name));
    }
  }
}

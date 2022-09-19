import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { map, Observable } from 'rxjs';

import { TitleService } from './title.service';

@Injectable({
  providedIn: 'root',
})
export class TitleResolverService implements Resolve<string> {
  constructor(private titleService: TitleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Title';
    } else {
      return this.titleService.getByKey(id).pipe(map((title) => title.title));
    }
  }
}

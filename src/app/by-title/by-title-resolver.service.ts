import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { TitleService } from '../services/title.service';

@Injectable({
  providedIn: 'root',
})
export class ByTitleResolverService implements Resolve<string> {
  constructor(private titleService: TitleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    return this.titleService.getByKey(id).pipe(map((title) => title.title));
  }
}

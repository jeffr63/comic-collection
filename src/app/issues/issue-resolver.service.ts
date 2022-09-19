import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { IssueService } from './issue.service';

@Injectable({
  providedIn: 'root',
})
export class IssueResolverService implements Resolve<string> {
  constructor(private issueService: IssueService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Issue';
    } else {
      return this.issueService.getByKey(id).pipe(map((issue) => issue.title));
    }
  }
}

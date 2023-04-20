import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { IssueService } from '../services/issue.service';

@Injectable({
  providedIn: 'root',
})
export class IssueResolverService {
  issueService = inject(IssueService);

  async resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Issue';
    } else {
      const issue = await this.issueService.getById(Number(id));
      return issue.title;
    }
  }
}

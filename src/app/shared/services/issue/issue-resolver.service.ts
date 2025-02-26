import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { IssueDataService } from './issue-data.service';

export const issueTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Issue';
  } else {
    const issue = await inject(IssueDataService).getById(Number(id));
    return issue.title;
  }
};

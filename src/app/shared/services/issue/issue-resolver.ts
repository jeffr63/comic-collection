import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { IssueData } from './issue-data';

export const issueTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Issue';
  } else {
    const issue = await inject(IssueData).getById(Number(id));
    return issue.title;
  }
};

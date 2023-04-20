import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { IssueResolverService } from '../shared/resolvers/issue-resolver.service';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./issue-list.component'),
      },
      {
        path: ':id',
        title: IssueResolverService,
        loadComponent: () => import('./issue-edit.component'),
        canActivate: [() => inject(AuthService).isLoggedIn()],
      },
    ],
  },
] as Route[];

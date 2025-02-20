import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthDataService } from '../shared/services/auth-data.service';
import { issueTitleResolver } from '../shared/resolvers/issue-resolver.service';

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
        title: issueTitleResolver,
        loadComponent: () => import('./issue-edit.component'),
        canActivate: [() => inject(AuthDataService).isLoggedIn()],
      },
    ],
  },
] as Route[];

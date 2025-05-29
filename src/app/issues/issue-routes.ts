import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthService } from '../shared/services/auth/auth-service';
import { issueTitleResolver } from '../shared/services/issue/issue-resolver';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./issue-list'),
      },
      {
        path: ':id',
        title: issueTitleResolver,
        loadComponent: () => import('./issue-edit'),
        canActivate: [() => inject(AuthService).isLoggedIn()],
      },
    ],
  },
] as Route[];

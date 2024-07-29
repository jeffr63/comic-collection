import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthStore } from '../shared/store/auth.store';
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
        canActivate: [() => inject(AuthStore).isLoggedIn()],
      },
    ],
  },
] as Route[];

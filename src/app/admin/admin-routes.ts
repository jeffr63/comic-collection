import { Route } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../shared/services/auth/auth-service';
import { publisherNameResolver } from '../shared/services/publisher/publisher-resolver';
import { titleTitleResolver } from '../shared/services/title/title-resolver';
import { userNameResolver } from '../shared/services/user/user-resolver';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./admin-dashboard'),
      },
      {
        path: 'titles',
        title: 'Titles',
        loadComponent: () => import('./title/title-list'),
      },
      {
        path: 'title/:id',
        title: titleTitleResolver,
        loadComponent: () => import('./title/title-edit'),
      },
      {
        path: 'publishers',
        title: 'Publishes',
        loadComponent: () => import('./publisher/publisher-list'),
      },
      {
        path: 'publisher/:id',
        title: publisherNameResolver,
        loadComponent: () => import('./publisher/publisher-edit'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user/user-list'),
      },
      {
        path: 'users/:id',
        title: userNameResolver,
        loadComponent: () => import('./user/user-edit'),
      },
    ],
    canActivate: [() => inject(AuthService).isLoggedInAsAdmin()],
  },
] as Route[];

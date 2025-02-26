import { Route } from '@angular/router';
import { inject } from '@angular/core';

import { AuthDataService } from '../shared/services/auth/auth-data.service';
import { publisherNameResolver } from '../shared/services/publisher/publisher-resolver.service';
import { titleTitleResolver } from '../shared/services/title/title-resolver.service';
import { userNameResolver } from '../shared/services/user/user-resolver.service';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./admin.component'),
      },
      {
        path: 'titles',
        title: 'Titles',
        loadComponent: () => import('./title/title-list.component'),
      },
      {
        path: 'title/:id',
        title: titleTitleResolver,
        loadComponent: () => import('./title/title-edit.component'),
      },
      {
        path: 'publishers',
        title: 'Publishes',
        loadComponent: () => import('./publisher/publisher-list.component'),
      },
      {
        path: 'publisher/:id',
        title: publisherNameResolver,
        loadComponent: () => import('./publisher/publisher-edit.component'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user/user-list.component'),
      },
      {
        path: 'users/:id',
        title: userNameResolver,
        loadComponent: () => import('./user/user-edit.component'),
      },
    ],
    canActivate: [() => inject(AuthDataService).isLoggedInAsAdmin()],
  },
] as Route[];

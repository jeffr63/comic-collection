import { Route } from '@angular/router';
import { inject } from '@angular/core';

import { AuthDataService } from '../shared/services/auth-data.service';
import { publisherNameResolver } from '../shared/resolvers/publisher-resolver.service';
import { titleTitleResolver } from '../shared/resolvers/title-resolver.service';
import { userNameResolver } from '../shared/resolvers/user-resolver.service';

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
        loadComponent: () => import('./title-list.component'),
      },
      {
        path: 'title/:id',
        title: titleTitleResolver,
        loadComponent: () => import('./title-edit.component'),
      },
      {
        path: 'publishers',
        title: 'Publishes',
        loadComponent: () => import('./publisher-list.component'),
      },
      {
        path: 'publisher/:id',
        title: publisherNameResolver,
        loadComponent: () => import('./publisher-edit.component'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user-list.component'),
      },
      {
        path: 'users/:id',
        title: userNameResolver,
        loadComponent: () => import('./user-edit.component'),
      },
    ],
    canActivate: [() => inject(AuthDataService).isLoggedInAsAdmin()],
  },
] as Route[];

import { Route } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { PublisherResolverService } from '../resolvers/publisher-resolver.service';
import { TitleResolverService } from '../resolvers/title-resolver.service';
import { UserResolverService } from '../resolvers/user-resolver.service';

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
        title: TitleResolverService,
        loadComponent: () => import('./title-edit.component'),
      },
      {
        path: 'publishers',
        title: 'Publishes',
        loadComponent: () => import('./publisher-list.component'),
      },
      {
        path: 'publisher/:id',
        title: PublisherResolverService,
        loadComponent: () => import('./publisher-edit.component'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user-list.component'),
      },
      {
        path: 'users/:id',
        title: UserResolverService,
        loadComponent: () => import('./user-edit.component'),
      },
    ],
    canActivate: [() => inject(AuthService).isLoggedInAsAdmin()],
  },
] as Route[];

import { Route } from '@angular/router';

import { publisherNameResolver } from '../shared/resolvers/publisher-resolver.service';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./by-publisher.component'),
      },
      {
        path: ':id',
        title: publisherNameResolver,
        loadComponent: () => import('./publisher-title-list.component'),
      },
    ],
  },
] as Route[];

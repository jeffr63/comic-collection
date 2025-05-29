import { Route } from '@angular/router';

import { publisherNameResolver } from '../shared/services/publisher/publisher-resolver';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./by-publisher'),
      },
      {
        path: ':id',
        title: publisherNameResolver,
        loadComponent: () => import('./publisher-title-list'),
      },
    ],
  },
] as Route[];

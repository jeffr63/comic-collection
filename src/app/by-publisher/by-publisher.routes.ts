import { Route } from '@angular/router';

import { PublisherResolverService } from '../resolvers/publisher-resolver.service';

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
        title: PublisherResolverService,
        loadComponent: () => import('./publisher-title-list.component'),
      },
    ],
  },
] as Route[];

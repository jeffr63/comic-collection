import { Route } from '@angular/router';

import { ByTitleResolverService } from './by-title-resolver.service';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./by-title.component'),
      },
      {
        path: ':id',
        title: ByTitleResolverService,
        loadComponent: () => import('./title-issue-list.component'),
      },
    ],
  },
] as Route[];

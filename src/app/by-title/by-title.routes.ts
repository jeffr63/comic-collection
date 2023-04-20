import { Route } from '@angular/router';

import { TitleResolverService } from '../resolvers/title-resolver.service';

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
        title: TitleResolverService,
        loadComponent: () => import('./title-issue-list.component'),
      },
    ],
  },
] as Route[];

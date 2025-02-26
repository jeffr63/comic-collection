import { Route } from '@angular/router';

import { titleTitleResolver } from '../shared/services/title/title-resolver.service';

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
        title: titleTitleResolver,
        loadComponent: () => import('./title-issue-list.component'),
      },
    ],
  },
] as Route[];

import { Route } from '@angular/router';

import { titleTitleResolver } from '../shared/services/title/title-resolver';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./by-title'),
      },
      {
        path: ':id',
        title: titleTitleResolver,
        loadComponent: () => import('./title-issue-list'),
      },
    ],
  },
] as Route[];

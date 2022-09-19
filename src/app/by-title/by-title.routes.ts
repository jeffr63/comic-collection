import { ByTitleResolverService } from './by-title-resolver.service';

export const BY_TITLE_ROUTES = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./by-title.component').then((c) => c.ByTitleListComponent),
      },
      {
        path: ':id',
        title: ByTitleResolverService,
        loadComponent: () =>
          import('./title-issue-list.component').then(
            (c) => c.TitleIssueListComponent
          ),
      },
    ],
  },
];

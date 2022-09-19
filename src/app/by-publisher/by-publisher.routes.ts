import { ByPublisherResolverService } from './by-publisher-resolver.service';

export const BY_PUBLISHER_ROUTES = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./by-publisher.component').then(
            (c) => c.ByPublisherComponent
          ),
      },
      {
        path: ':id',
        title: ByPublisherResolverService,
        loadComponent: () =>
          import('./publisher-title-list.component').then(
            (c) => c.PublisherTitleListComponent
          ),
      },
    ],
  },
];

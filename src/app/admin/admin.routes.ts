import { CanActivateAdmin } from '../auth/canActiveateAdmin.guard';
import { UserResolverService } from '../services/user-resolver.service';
import { PublisherResolverService } from '../services/publisher-resolver.service';
import { TitleResolverService } from '../services/title-resolver.service';

export const ADMIN_ROUTES = [
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
    canActivate: [CanActivateAdmin],
  },
];

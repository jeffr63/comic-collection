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
        loadComponent: () =>
          import('./admin.component').then((m) => m.AdminComponent),
      },
      {
        path: 'titles',
        title: 'Titles',
        loadComponent: () =>
          import('./title-list.component').then((m) => m.TitleListComponent),
      },
      {
        path: 'title/:id',
        title: TitleResolverService,
        loadComponent: () =>
          import('./title-edit.component').then((m) => m.TitleEditComponent),
      },
      {
        path: 'publishers',
        title: 'Publishes',
        loadComponent: () =>
          import('./publisher-list.component').then(
            (m) => m.PublisherListComponent
          ),
      },
      {
        path: 'publisher/:id',
        title: PublisherResolverService,
        loadComponent: () =>
          import('./publisher-edit.component').then(
            (m) => m.PublisherEditComponent
          ),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () =>
          import('./user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'users/:id',
        title: UserResolverService,
        loadComponent: () =>
          import('./user-edit.component').then((m) => m.UserEditComponent),
      },
    ],
    canActivate: [CanActivateAdmin],
  },
];

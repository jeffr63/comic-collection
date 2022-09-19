import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { IssueResolverService } from './issue-resolver.service';

export const ISSUES_ROUTES = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./issue-list.component').then((m) => m.IssueListComponent),
      },
      {
        path: ':id',
        title: IssueResolverService,
        loadComponent: () =>
          import('./issue-edit.component').then((m) => m.IssueEditComponent),
        canActivate: [CanActivateEdit],
      },
    ],
  },
];

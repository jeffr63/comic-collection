import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { IssueAllListComponent } from './issue-list.component';
import { IssueResolverService } from './issue-resolver.service';

export const ISSUES_ROUTES = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./issue-list.component').then((c) => c.IssueAllListComponent),
      },
      {
        path: ':id',
        title: IssueResolverService,
        loadComponent: () =>
          import('./issue-edit.component').then((c) => c.IssueEditComponent),
        canActivate: [CanActivateEdit],
      },
    ],
  },
];

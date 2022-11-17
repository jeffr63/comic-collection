import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { IssueResolverService } from './issue-resolver.service';

export const ISSUES_ROUTES = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./issue-list.component'),
      },
      {
        path: ':id',
        title: IssueResolverService,
        loadComponent: () => import('./issue-edit.component'),
        canActivate: [CanActivateEdit],
      },
    ],
  },
];

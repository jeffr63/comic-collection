import { Route } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

export const APP_ROUTES: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'admin',
    title: 'Administration',
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'by_publisher',
    title: 'By Publisher',
    loadChildren: () => import('./by-publisher/by-publisher.routes'),
  },
  {
    path: 'by_title',
    title: 'By Title',
    loadChildren: () => import('./by-title/by-title.routes'),
  },
  {
    path: 'issues',
    title: 'All Issues',
    loadChildren: () => import('./issues/issue.routes'),
  },
  { path: 'home', title: 'Home', component: DashboardComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

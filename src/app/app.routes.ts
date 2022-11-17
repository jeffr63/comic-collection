import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'admin',
    title: 'Administration',
    loadChildren: () => import('./admin/admin.routes').then((r) => r.ADMIN_ROUTES),
  },
  {
    path: 'by_publisher',
    title: 'By Publisher',
    loadChildren: () => import('./by-publisher/by-publisher.routes').then((r) => r.BY_PUBLISHER_ROUTES),
  },
  {
    path: 'by_title',
    title: 'By Title',
    loadChildren: () => import('./by-title/by-title.routes').then((r) => r.BY_TITLE_ROUTES),
  },
  {
    path: 'issues',
    title: 'All Issues',
    loadChildren: () => import('./issues/issue.routes').then((r) => r.ISSUES_ROUTES),
  },
  { path: 'home', title: 'Home', component: DashboardComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

import { inject } from "@angular/core";
import { Route } from "@angular/router";

import { AuthService } from "../auth/auth.service";
//import { IssueResolverService } from './issue-resolver.service';

export default [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () => import("./issue-list.component"),
      },
      {
        path: ":id",
        //title: IssueResolverService,
        loadComponent: () => import("./issue-edit.component"),
        canActivate: [() => inject(AuthService).isLoggedIn()],
      },
    ],
  },
] as Route[];

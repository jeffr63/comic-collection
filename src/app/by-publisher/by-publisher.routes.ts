import { Route } from "@angular/router";

//import { ByPublisherResolverService } from './by-publisher-resolver.service';

export default [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () => import("./by-publisher.component"),
      },
      {
        path: ":id",
        //title: ByPublisherResolverService,
        loadComponent: () => import("./publisher-title-list.component"),
      },
    ],
  },
] as Route[];

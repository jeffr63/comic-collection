import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { TitleStore } from '../store/title.store';

export const titleTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Title';
  } else {
    const title = await inject(TitleStore).getById(Number(id));
    return title.title;
  }
};

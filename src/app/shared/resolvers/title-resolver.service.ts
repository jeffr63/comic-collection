import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { TitleFacade } from '../facades/title.facade';

export const titleTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Title';
  } else {
    const title = await inject(TitleFacade).getById(Number(id));
    return title.title;
  }
};

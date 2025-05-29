import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { TitleData } from './title-data';

export const titleTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Title';
  } else {
    const title = await inject(TitleData).getById(Number(id));
    return title.title;
  }
};

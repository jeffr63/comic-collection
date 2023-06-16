import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { TitleService } from '../services/title.service';

export const titleTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Title';
  } else {
    const title = await inject(TitleService).getById(Number(id));
    return title.title;
  }
};

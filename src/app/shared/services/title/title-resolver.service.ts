import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { TitleDataService } from './title-data.service';

export const titleTitleResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Title';
  } else {
    const title = await inject(TitleDataService).getById(Number(id));
    return title.title;
  }
};

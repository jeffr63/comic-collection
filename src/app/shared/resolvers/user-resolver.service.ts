import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { UserFacade } from '../facades/user.facade';

export const userNameResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New User';
  } else {
    const user = await inject(UserFacade).getById(Number(id));
    return user.name;
  }
};

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { UserService } from '../services/user.service';

export const userNameResolver: ResolveFn<string> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New User';
  } else {
    const user = await inject(UserService).getById(Number(id));
    return user.name;
  }
};

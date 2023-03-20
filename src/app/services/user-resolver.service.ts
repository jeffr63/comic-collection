import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolverService {
  userService = inject(UserService);

  async resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New User';
    } else {
      const user = await this.userService.getById(Number(id));
      return user.name;
    }
  }
}

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { TitleService } from '../services/title.service';

@Injectable({
  providedIn: 'root',
})
export class ByTitleResolverService {
  titleService = inject(TitleService);

  async resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    const title = await this.titleService.getById(Number(id));
    return title.title;
  }
}

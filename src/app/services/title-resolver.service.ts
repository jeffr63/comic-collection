import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Title } from '../models/title';
import { TitleService } from './title.service';

@Injectable({
  providedIn: 'root',
})
export class TitleResolverService {
  titleService = inject(TitleService);

  async resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Title';
    } else {
      const title = this.titleService.getById(Number(id)) as unknown as Title;
      return title.title;
    }
  }
}

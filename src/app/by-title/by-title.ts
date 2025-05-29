import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth/auth-service';
import { Column } from '../shared/models/column-interface';
import { DisplayTable } from '../shared/components/display-table';
import { TitleData } from '../shared/services/title/title-data';

@Component({
  selector: 'app-by-title-list',
  imports: [DisplayTable],
  template: `
    <section class="mt-5">
      @if (titles()) {
      <app-display-table
        [includeAdd]="false"
        [isAuthenticated]="isAuthenticated()"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="titles()"
        [tableColumns]="columns"
        (open)="open($event)" />
      }
    </section>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      section {
        margin: 10px 20px;
      }
    `,
  ],
})
export default class ByTitleList {
  readonly #authStore = inject(AuthService);
  readonly #router = inject(Router);
  readonly #titleStore = inject(TitleData);

  protected readonly isAuthenticated = this.#authStore.isLoggedIn;
  protected readonly titles = this.#titleStore.titles;

  protected readonly columns: Column[] = [
    {
      key: 'title',
      name: 'Title',
      width: '300px',
      type: 'sort',
      position: 'left',
      sortDefault: true,
    },
    {
      key: 'publisher',
      name: 'Publisher',
      width: '300px',
      type: 'sort',
      position: 'left',
      sortDefault: false,
    },
    {
      key: 'view',
      name: '',
      width: '50px',
      type: 'view',
      position: 'left',
    },
  ];

  protected open(id: number) {
    this.#router.navigate(['/by_title', id]);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthFacade } from '../shared/facades/auth.facade';
import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { TitleFacade } from '../shared/facades/title.facade';

@Component({
  selector: 'app-by-title-list',
  standalone: true,
  imports: [DisplayTableComponent],
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
export default class ByTitleListComponent implements OnInit {
  readonly #authStore = inject(AuthFacade);
  readonly #router = inject(Router);
  readonly #titleStore = inject(TitleFacade);

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

  async ngOnInit() {
    if (this.titles().length === 0) {
      await this.#titleStore.getAll();
    }
  }

  protected open(id: number) {
    this.#router.navigate(['/by_title', id]);
  }
}

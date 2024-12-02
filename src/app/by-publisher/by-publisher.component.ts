import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthFacade } from '../shared/facades/auth.facade';
import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { PublisherFacade } from '../shared/facades/publisher.facade';

@Component({
  selector: 'app-by-publisher',
  imports: [DisplayTableComponent],
  template: `
    <section class="mt-5">
      @if (publishers()) {
      <app-display-table
        [includeAdd]="false"
        [isAuthenticated]="isAuthenticated()"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="publishers()"
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
export default class ByPublisherComponent {
  readonly #authStore = inject(AuthFacade);
  readonly #publisherStore = inject(PublisherFacade);
  readonly #router = inject(Router);

  protected readonly isAuthenticated = this.#authStore.isLoggedIn;
  protected readonly publishers = this.#publisherStore.publishers;

  protected readonly columns: Column[] = [
    {
      key: 'name',
      name: 'Publisher',
      width: '300px',
      type: 'sort',
      position: 'left',
      sortDefault: true,
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
    this.#router.navigate(['/by_publisher', id]);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth/auth-service';
import { Column } from '../shared/models/column-interface';
import { DisplayTable } from '../shared/components/display-table';
import { PublisherData } from '../shared/services/publisher/publisher-data';

@Component({
  selector: 'app-by-publisher',
  imports: [DisplayTable],
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
  styles: `
    table {
      width: 100%;
    }
    section {
      margin: 10px 20px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ByPublisher {
  readonly #authStore = inject(AuthService);
  readonly #publisherStore = inject(PublisherData);
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

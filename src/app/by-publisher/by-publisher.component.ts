import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { PublisherService } from '../shared/services/publisher.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-by-publisher',
  standalone: true,
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
export default class ByPublisherComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #publisherService = inject(PublisherService);
  readonly #router = inject(Router);

  protected readonly isAuthenticated = this.#authService.isLoggedIn;
  protected readonly publishers = this.#publisherService.publishers;

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

  async ngOnInit() {
    if (this.publishers().length === 0) {
      await this.#publisherService.getAll();
    }
  }

  protected open(id: number) {
    this.#router.navigate(['/by_publisher', id]);
  }
}

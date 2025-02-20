import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthDataService } from '../shared/services/auth-data.service';
import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { PublisherDataService } from '../shared/services/publisher-data.service';
import { TitleDataService } from '../shared/services/title-data.service';

@Component({
  selector: 'app-publisher-title-list',
  imports: [DisplayTableComponent],
  template: ` <section class="mt-5">
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
  </section>`,
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
export default class PublisherTitleListComponent implements OnInit {
  readonly #authStore = inject(AuthDataService);
  readonly #publisherStore = inject(PublisherDataService);
  readonly #router = inject(Router);
  readonly #titleStore = inject(TitleDataService);

  protected readonly id = input<string>();
  protected readonly isAuthenticated = this.#authStore.isLoggedIn;
  protected readonly allTitles = this.#titleStore.titles;
  protected readonly publisher = signal('');
  protected readonly titles = computed(() => {
    return this.allTitles().filter((title) => title.publisher === this.publisher());
  });

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

  ngOnInit() {
    if (this.id() !== 'new' && this.id() != undefined) {
      this.loadData(+this.id());
    }
  }

  private async loadData(id: number) {
    const publisher = await this.#publisherStore.getById(id);
    this.publisher.set(publisher.name);
  }

  protected open(id: number) {
    this.#router.navigate(['/by_title', id]);
  }
}

import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStore } from '../shared/store/auth.store';
import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { Publisher } from '../shared/models/publisher';
import { PublisherService } from '../shared/services/publisher.service';
import { TitleService } from '../shared/services/title.service';
import { TitleStore } from '../shared/store/title.store';

@Component({
  selector: 'app-publisher-title-list',
  standalone: true,
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
  readonly #authStore = inject(AuthStore);
  readonly #publisherService = inject(PublisherService);
  readonly #router = inject(Router);
  readonly #titleService = inject(TitleService);
  readonly #titleStore = inject(TitleStore);

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
    if (this.allTitles().length === 0) {
      await this.#titleService.getAll();
    }
    const publisher = (await this.#publisherService.getById(id)) as unknown as Publisher;
    this.publisher.set(publisher.name);
  }

  protected open(id: number) {
    this.#router.navigate(['/by_title', id]);
  }
}

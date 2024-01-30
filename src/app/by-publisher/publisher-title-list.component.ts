import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Column } from '../shared/models/column';
import { PublisherService } from '../shared/services/publisher.service';
import { TitleService } from '../shared/services/title.service';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { Publisher } from '../shared/models/publisher';
import { AuthService } from '../shared/services/auth.service';

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
  authService = inject(AuthService);
  publisherService = inject(PublisherService);
  router = inject(Router);
  titleService = inject(TitleService);

  @Input() id?: string;
  isAuthenticated = this.authService.isLoggedIn;
  allTitles = this.titleService.titles;
  publisher = signal('');
  titles = computed(() => {
    return this.allTitles().filter((title) => title.publisher === this.publisher());
  });

  columns: Column[] = [
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
    if (this.id != undefined) {
      this.loadData(parseInt(this.id));
    }
  }

  async loadData(id: number) {
    if (this.allTitles().length === 0) {
      await this.titleService.getAll();
    }
    const publisher = (await this.publisherService.getById(id)) as unknown as Publisher;
    this.publisher.set(publisher.name);
  }

  open(id: number) {
    this.router.navigate(['/by_title', id]);
  }
}

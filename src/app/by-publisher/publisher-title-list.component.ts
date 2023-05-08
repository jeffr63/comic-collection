import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Column } from '../shared/models/column';
import { PublisherService } from '../shared/services/publisher.service';
import { TitleService } from '../shared/services/title.service';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { NgIf } from '@angular/common';
import { Publisher } from '../shared/models/publisher';

@Component({
  selector: 'app-publisher-title-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: ` <section class="mt-5">
    <app-display-table
      *ngIf="titles()"
      [includeAdd]="false"
      [isAuthenticated]="false"
      [isFilterable]="true"
      [isPageable]="true"
      [paginationSizes]="[5, 10, 25, 100]"
      [defaultPageSize]="10"
      [disableClear]="true"
      [tableData]="titles()"
      [tableColumns]="columns"
      (open)="open($event)"
    ></app-display-table>
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
  publisherService = inject(PublisherService);
  router = inject(Router);
  titleService = inject(TitleService);

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

  @Input() id?: string;

  publisher = signal('');
  titles = computed(() => {
    return this.titleService.titles().filter((title) => title.publisher === this.publisher());
  });

  ngOnInit() {
    if (this.id != undefined) {
      this.loadData(parseInt(this.id));
    }
  }

  async loadData(id: number) {
    if (this.titleService.titles().length === 0) {
      await this.titleService.getAll();
    }
    const publisher = (await this.publisherService.getById(id)) as unknown as Publisher;
    this.publisher.set(publisher.name);
  }

  open(id: number) {
    this.router.navigate(['/by_title', id]);
  }
}

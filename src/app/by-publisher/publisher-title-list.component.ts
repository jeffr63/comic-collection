import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Column } from '../models/column';
import { PublisherService } from '../services/publisher.service';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';
import { DisplayTableComponent } from '../shared/display-table.component';
import { NgIf } from '@angular/common';
import { Publisher } from '../models/publisher';

@Component({
  selector: 'app-publisher-title-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: ` <section class="mt-5">
    <app-display-table
      *ngIf="titles"
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
  route = inject(ActivatedRoute);
  publisherService = inject(PublisherService);
  titleService = inject(TitleService);
  router = inject(Router);

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

  titles = signal<Title[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.loadData(parseInt(id));
    }
  }

  async loadData(id: number) {
    const publisher = (await this.publisherService.getById(id)) as unknown as Publisher;
    this.getTitlesForPublisher(publisher.name);
  }

  async getTitlesForPublisher(publisher: string) {
    const titles = await this.titleService.search(`publisher=${publisher}`);
    this.titles.set(titles);
  }

  open(id: number) {
    this.router.navigate(['/by_title', id]);
  }
}

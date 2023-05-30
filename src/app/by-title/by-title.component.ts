import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { TitleService } from '../shared/services/title.service';

@Component({
  selector: 'app-by-title-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: `
    <section class="mt-5">
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
  titleService = inject(TitleService);
  router = inject(Router);

  titles = this.titleService.titles;

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

  async ngOnInit() {
    if (this.titles().length === 0) {
      await this.titleService.getAll();
    }
  }

  open(id: number) {
    this.router.navigate(['/by_title', id]);
  }
}

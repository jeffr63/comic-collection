import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Column } from '../shared/models/column';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { TitleService } from '../shared/services/title.service';
import { AuthService } from '../shared/services/auth.service';

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
  authService = inject(AuthService);
  titleService = inject(TitleService);
  router = inject(Router);

  isAuthenticated = this.authService.isLoggedIn;
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

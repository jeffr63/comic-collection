import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { DisplayTableComponent } from '../shared/display-table.component';
import { Title } from '../models/title';
import { Subject, takeUntil } from 'rxjs';
import { TitleService } from '../services/title.service';
import { Router } from '@angular/router';
import { Column } from '../models/column';

@Component({
  selector: 'app-by-title-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="titles"
        [includeAdd]="false"
        [isAuthenticated]="false"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="titles"
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
export class ByTitleListComponent implements OnInit, OnDestroy {
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
  loading = false;
  titles: Title[] = [];
  componentIsDestroyed = new Subject<boolean>();

  constructor(private titleService: TitleService, private router: Router) {}
  ngOnInit(): void {
    this.getAllPublishers();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  getAllPublishers() {
    this.titleService
      .getAll()
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe({
        next: (data) => {
          this.titles = data;
        },
      });
  }

  open(id: number) {
    this.router.navigate(['/by_title', id]);
  }
}

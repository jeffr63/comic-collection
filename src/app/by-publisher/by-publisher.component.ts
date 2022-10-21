import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';

import { Column } from '../models/column';
import { DisplayTableComponent } from '../shared/display-table.component';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';

@Component({
  selector: 'app-by-publisher',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="publishers"
        [includeAdd]="false"
        [isAuthenticated]="false"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="publishers"
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
export class ByPublisherComponent implements OnInit, OnDestroy {
  columns: Column[] = [
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
  loading = false;
  componentIsDestroyed = new Subject<boolean>();
  publishers: Publisher[] = [];
  publishers$ = this.publisherService.entities$
    .pipe(takeUntil(this.componentIsDestroyed))
    .pipe(
      tap((data) => {
        this.publishers = data;
      })
    )
    .subscribe();

  constructor(
    private publisherService: PublisherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllPublishers();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  getAllPublishers() {
    this.publisherService.getAll();
  }

  open(id: number) {
    this.router.navigate(['/by_publisher', id]);
  }
}

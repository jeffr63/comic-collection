import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, take, takeUntil } from 'rxjs';

import { Column } from '../models/column';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';
import { DisplayTableComponent } from '../shared/display-table.component';
import { NgIf } from '@angular/common';

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
      [tableData]="titles"
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
export class PublisherTitleListComponent implements OnInit, OnDestroy {
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
  componentIsDestroyed = new Subject<boolean>();
  titles: Title[] = [];

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private titleService: TitleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  loadData() {
    this.route.params.subscribe((params) => {
      this.publisherService
        .getByKey(params['id'])
        .pipe(take(1))
        .subscribe({
          next: (publisher: Publisher) => {
            this.getTitlesForPublisher(publisher.name);
          },
        });
    });
  }

  getTitlesForPublisher(publisher: string) {
    this.titleService
      .getAll()
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe({
        next: (data) => {
          this.titles = data.filter((title) => title.publisher === publisher);
        },
      });
  }

  open(id: number) {
    this.router.navigate(['/by_title', id]);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Observable, Subject, take, takeUntil, tap } from 'rxjs';

import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="titles"
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="titles"
        [tableColumns]="columns"
        (add)="newTitle()"
        (delete)="deleteTitle($event)"
        (edit)="editTitle($event)"
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
export default class TitleListComponent implements OnInit, OnDestroy {
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
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];
  componentIsDestroyed = new Subject<boolean>();
  titles: Title[] = [];
  titles$ = this.titleService.entities$
    .pipe(takeUntil(this.componentIsDestroyed))
    .pipe(
      tap((data) => {
        this.titles = data;
      })
    )
    .subscribe();

  constructor(
    private titleService: TitleService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllTitles();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  deleteTitle(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this title?',
      body: 'All information associated to this title will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.titleService.delete(id);
        }
      });
  }

  editTitle(id: number) {
    this.router.navigate(['/admin/title', id]);
  }

  getAllTitles(): void {
    this.titleService.getAll();
  }

  newTitle() {
    this.router.navigate(['/admin/title/new']);
  }
}

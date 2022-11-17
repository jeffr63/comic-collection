import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { Subject, take, takeUntil, tap } from 'rxjs';

import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf, RouterLink],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="publishers"
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="publishers"
        [tableColumns]="columns"
        (add)="newPublisher()"
        (delete)="deletePublisher($event)"
        (edit)="editPublisher($event)"
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
export default class PublisherListComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      key: 'name',
      name: 'Publisher',
      width: '600px',
      type: 'sort',
      position: 'left',
      sortDefault: true,
    },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];
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
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllPublishers();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  deletePublisher(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this publisher',
      body: 'All information associated to this publisher will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.publisherService.delete(id);
          //this.getAllPublishers();
        }
      });
  }

  editPublisher(id: number) {
    this.router.navigate(['/admin/publisher', id]);
  }

  getAllPublishers(): void {
    this.publisherService.getAll();
  }

  newPublisher() {
    this.router.navigate(['/admin/publisher/new']);
  }
}

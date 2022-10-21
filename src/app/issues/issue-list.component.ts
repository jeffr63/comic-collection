import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Column } from '../models/column';
import { Issue } from '../models/issue';
import { IssueService } from './issue.service';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';

@Component({
  selector: 'app-issue-all-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="issues"
        [includeAdd]="true"
        [isAuthenticated]="authService.isAuthenticated"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="issues"
        [tableColumns]="columns"
        (add)="newIssue()"
        (delete)="deleteIssue($event)"
        (edit)="editIssue($event)"
      ></app-display-table>
    </section>
  `,

  styles: [
    `
      section {
        margin: 10px 20px;
      }
    `,
  ],
})
export class IssueAllListComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      key: 'title',
      name: 'Title',
      width: '600px',
      type: 'sort',
      position: 'left',
      sortDefault: true,
    },
    {
      key: 'publisher',
      name: 'Publisher',
      width: '400px',
      type: 'sort',
      position: 'left',
    },
    {
      key: 'issue',
      name: 'Issue Number',
      width: '50px',
      type: 'sort',
      position: 'left',
    },
    {
      key: 'coverPrice',
      name: 'Cover Price',
      width: '50px',
      type: 'currency_sort',
      position: 'left',
    },
    {
      key: 'url',
      name: 'Link',
      width: '20px',
      type: 'link',
      position: 'left',
    },
    {
      key: 'action',
      name: '',
      width: '50px',
      type: 'action',
      position: 'left',
    },
  ];
  loading = false;
  issues: Issue[] = [];
  componentIsDestroyed = new Subject<boolean>();

  constructor(
    private issueService: IssueService,
    private dialog: MatDialog,
    public authService: AuthService,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllIssues();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  deleteIssue(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.issueService.delete(id);
          this.getAllIssues();
        }
      });
  }

  editIssue(id: number) {
    this.router.navigate(['/issues', id]);
  }

  getAllIssues(): void {
    this.issueService
      .getAll()
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe({
        next: (data) => {
          this.issues = data;
        },
      });
  }

  newIssue() {
    this.router.navigate(['/issues/new']);
  }
}

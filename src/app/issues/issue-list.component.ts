import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { IssueService } from '../shared/services/issue.service';
import { ModalDataService } from '../shared/modals/modal-data.service';

@Component({
  selector: 'app-issue-all-list',
  standalone: true,
  imports: [DisplayTableComponent],

  template: `
    <section class="mt-5">
      @if (issues()) {
      <app-display-table
        [includeAdd]="true"
        [isAuthenticated]="isLoggedIn()"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="issues()"
        [tableColumns]="columns"
        (add)="newIssue()"
        (delete)="deleteIssue($event)"
        (edit)="editIssue($event)"
      />
      }
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
export default class IssueAllListComponent implements OnInit {
  issueService = inject(IssueService);
  dialog = inject(MatDialog);
  authService = inject(AuthService);
  modalDataService = inject(ModalDataService);
  router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  issues = this.issueService.issues;

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

  async ngOnInit() {
    if (this.issues().length === 0) {
      await this.issueService.getAll();
    }
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
          this.delete(id);
        }
      });
  }

  async delete(id: number) {
    await this.issueService.delete(id);
  }

  editIssue(id: number) {
    this.router.navigate(['/issues', id]);
  }

  newIssue() {
    this.router.navigate(['/issues/new']);
  }
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { AuthDataService } from '../shared/services/auth-data.service';
import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { IssueDataService } from '../shared/services/issue-data.service';
import { ModalDataService } from '../shared/modals/modal-data.service';

@Component({
  selector: 'app-issue-all-list',
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
        (edit)="editIssue($event)" />
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
export default class IssueAllListComponent {
  readonly #authStore = inject(AuthDataService);
  readonly #dialog = inject(MatDialog);
  readonly #issueStore = inject(IssueDataService);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);

  isLoggedIn = this.#authStore.isLoggedIn;
  issues = this.#issueStore.issues;

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

  deleteIssue(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.#dialog.open(DeleteComponent, { width: '500px' });

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
    await this.#issueStore.delete(id);
  }

  editIssue(id: number) {
    this.#router.navigate(['/issues', id]);
  }

  newIssue() {
    this.#router.navigate(['/issues/new']);
  }
}

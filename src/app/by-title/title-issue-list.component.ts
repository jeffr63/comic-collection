import { Component, computed, inject, input, Input, numberAttribute, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { TitleService } from '../shared/services/title.service';
import { IssueService } from '../shared/services/issue.service';
import { Title } from '../shared/models/title';

@Component({
  selector: 'app-title-issue-list',
  standalone: true,
  imports: [DisplayTableComponent],
  template: `
    <section class="mt-5">
      @if (titleIssues()) {
      <app-display-table
        [includeAdd]="true"
        [isAuthenticated]="isLoggedIn()"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="titleIssues()"
        [tableColumns]="columns"
        (add)="newIssue()"
        (delete)="deleteIssue($event)"
        (edit)="editIssue($event)" />
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
export default class TitleIssueListComponent implements OnInit {
  authService = inject(AuthService);
  dialog = inject(MatDialog);
  issueService = inject(IssueService);
  modalDataService = inject(ModalDataService);
  router = inject(Router);
  titleService = inject(TitleService);

  @Input({ transform: numberAttribute }) id = 0;

  dialogRef!: MatDialogRef<DeleteComponent, any>;
  isLoggedIn = this.authService.isLoggedIn;
  issues = this.issueService.issues;
  title = signal('');
  titleIssues = computed(() => {
    return this.issues().filter((issue) => issue.title === this.title());
  });

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

  ngOnInit() {
    if (this.id != 0) {
      this.loadData(this.id);
    }
  }

  async loadData(id: number) {
    if (this.issues().length === 0) {
      await this.issueService.getAll();
    }
    const title = (await this.titleService.getById(id)) as unknown as Title;
    this.title.set(title.title);
  }

  deleteIssue(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    this.dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });

    this.dialogRef
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

import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth/auth-service';
import { Column } from '../shared/models/column-interface';
import { DeleteModal } from '../shared/modals/delete-modal';
import { DisplayTable } from '../shared/components/display-table';
import { IssueData } from '../shared/services/issue/issue-data';
import { ModalService } from '../shared/modals/modal-service';
import { Title } from '../shared/models/title-interface';
import { TitleData } from '../shared/services/title/title-data';

@Component({
  selector: 'app-title-issue-list',
  imports: [DisplayTable],
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
  styles: `
    table {
      width: 100%;
    }
    section {
      margin: 10px 20px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TitleIssueList implements OnInit {
  readonly #authStore = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #issueStore = inject(IssueData);
  readonly #modalDataService = inject(ModalService);
  readonly #router = inject(Router);
  readonly #titleStore = inject(TitleData);

  public id = input<string>();

  #dialogRef!: MatDialogRef<DeleteModal, any>;
  protected readonly isLoggedIn = this.#authStore.isLoggedIn;
  protected readonly issues = this.#issueStore.issues;
  public readonly title = signal('');
  protected readonly titleIssues = computed(() => {
    return this.issues().filter((issue) => issue.title === this.title());
  });

  protected readonly columns: Column[] = [
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
    if (this.id() != 'new') {
      this.loadData(+this.id());
    }
  }

  public async loadData(id: number) {
    const title = <Title>await this.#titleStore.getById(id);
    this.title.set(title.title);
  }

  public deleteIssue(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    this.#dialogRef = this.#dialog.open(DeleteModal, { width: '500px' });

    this.#dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.delete(id);
        }
      });
  }

  public async delete(id: number) {
    await this.#issueStore.delete(id);
  }

  public editIssue(id: number) {
    this.#router.navigate(['/issues', id]);
  }

  public newIssue() {
    this.#router.navigate(['/issues/new']);
  }
}

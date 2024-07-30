import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthStore } from '../shared/store/auth.store';
import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { IssueStore } from '../shared/store/issue.store';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { Title } from '../shared/models/title';
import { TitleStore } from '../shared/store/title.store';

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
  readonly #authStore = inject(AuthStore);
  readonly #dialog = inject(MatDialog);
  readonly #issueStore = inject(IssueStore);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);
  readonly #titleStore = inject(TitleStore);

  protected readonly id = input<string>();

  #dialogRef!: MatDialogRef<DeleteComponent, any>;
  protected readonly isLoggedIn = this.#authStore.isLoggedIn;
  protected readonly issues = this.#issueStore.issues;
  protected readonly title = signal('');
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

  private async loadData(id: number) {
    if (this.issues().length === 0) {
      await this.#issueStore.getAll();
    }
    const title = (await this.#titleStore.getById(id)) as unknown as Title;
    this.title.set(title.title);
  }

  protected deleteIssue(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    this.#dialogRef = this.#dialog.open(DeleteComponent, { width: '500px' });

    this.#dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.delete(id);
        }
      });
  }

  private async delete(id: number) {
    await this.#issueStore.delete(id);
  }

  protected editIssue(id: number) {
    this.#router.navigate(['/issues', id]);
  }

  protected newIssue() {
    this.#router.navigate(['/issues/new']);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthFacade } from '../shared/facades/auth.facade';
import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { TitleFacade } from '../shared/facades/title.facade';

@Component({
    selector: 'app-source-list',
    imports: [DisplayTableComponent],
    template: `
    <section class="mt-5">
      @if (titles()) {
      <app-display-table
        [isAuthenticated]="isAuthenticated()"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="titles()"
        [tableColumns]="columns"
        (add)="newTitle()"
        (delete)="deleteTitle($event)"
        (edit)="editTitle($event)" />
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
    ]
})
export default class TitleListComponent implements OnInit {
  readonly #authStore = inject(AuthFacade);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);
  readonly #titleStore = inject(TitleFacade);

  protected readonly isAuthenticated = this.#authStore.isLoggedInAsAdmin;
  protected readonly titles = this.#titleStore.titles;

  protected readonly columns: Column[] = [
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

  async ngOnInit() {
    if (this.titles().length === 0) {
      await this.#titleStore.getAll();
    }
  }

  protected deleteTitle(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this title?',
      body: 'All information associated to this title will be permanently deleted.',
      warning: 'This operation cannot be undone.',
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

  protected async delete(id: number) {
    await this.#titleStore.delete(id);
  }

  protected editTitle(id: number) {
    this.#router.navigate(['/admin/title', id]);
  }

  protected newTitle() {
    this.#router.navigate(['/admin/title/new']);
  }
}

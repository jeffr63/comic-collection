import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../../shared/services/auth/auth-service';
import { Column } from '../../shared/models/column-interface';
import { DeleteModal } from '../../shared/modals/delete-modal';
import { DisplayTable } from '../../shared/components/display-table';
import { ModalService } from '../../shared/modals/modal-service';
import { PublisherData } from '../../shared/services/publisher/publisher-data';

@Component({
  selector: 'app-publisher-list',
  imports: [DisplayTable],
  template: `
    <section class="mt-5">
      @if (publishers()) {
        <app-display-table
          [isAuthenticated]="isAuthenticated()"
          [isFilterable]="true"
          [includeAdd]="true"
          [isPageable]="true"
          [paginationSizes]="[5, 10, 25, 100]"
          [defaultPageSize]="10"
          [disableClear]="true"
          [tableData]="publishers()"
          [tableColumns]="columns"
          (add)="newPublisher()"
          (delete)="deletePublisher($event)"
          (edit)="editPublisher($event)" />
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
export default class PublisherList {
  readonly #authStore = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalService);
  readonly #publisherStore = inject(PublisherData);
  readonly #router = inject(Router);

  protected readonly isAuthenticated = this.#authStore.isLoggedInAsAdmin;
  protected publishers = this.#publisherStore.publishers;

  protected readonly columns: Column[] = [
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

  protected deletePublisher(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this publisher',
      body: 'All information associated to this publisher will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.#dialog.open(DeleteModal, { width: '500px' });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.delete(id);
        }
      });
  }

  private async delete(id: number) {
    await this.#publisherStore.delete(id);
  }

  protected editPublisher(id: number) {
    this.#router.navigate(['/admin/publisher', id]);
  }

  protected newPublisher() {
    this.#router.navigate(['/admin/publisher/new']);
  }
}

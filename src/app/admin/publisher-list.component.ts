import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { PublisherService } from '../shared/services/publisher.service';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [DisplayTableComponent, RouterLink],

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
export default class PublisherListComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalDataService);
  readonly #publisherService = inject(PublisherService);
  readonly #router = inject(Router);

  protected readonly isAuthenticated = this.#authService.isLoggedInAsAdmin;
  protected publishers = this.#publisherService.publishers;

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

  async ngOnInit() {
    if (this.publishers().length === 0) {
      await this.#publisherService.getAll();
    }
  }

  protected deletePublisher(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this publisher',
      body: 'All information associated to this publisher will be permanently deleted.',
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

  private async delete(id: number) {
    await this.#publisherService.delete(id);
  }

  protected editPublisher(id: number) {
    this.#router.navigate(['/admin/publisher', id]);
  }

  protected newPublisher() {
    this.#router.navigate(['/admin/publisher/new']);
  }
}

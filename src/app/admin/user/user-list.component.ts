import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthDataService } from '../../shared/services/auth/auth-data.service';
import { Column } from '../../shared/models/column';
import { DeleteComponent } from '../../shared/modals/delete.component';
import { DisplayTableComponent } from '../../shared/components/display-table.component';
import { ModalDataService } from '../../shared/modals/modal-data.service';
import { UserDataService } from '../../shared/services/user/user-data.service';

@Component({
  selector: 'app-user-list',
  imports: [DisplayTableComponent],
  template: `
    <section class="mt-5">
      @if (users()) {
      <app-display-table
        [isAuthenticated]="isAuthenticated()"
        [isFilterable]="true"
        [includeAdd]="false"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="users()"
        [tableColumns]="columns"
        (delete)="deleteUser($event)"
        (edit)="editUser($event)" />
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
export default class UserListComponent {
  readonly #authStore = inject(AuthDataService);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);
  readonly #userStore = inject(UserDataService);

  protected readonly isAuthenticated = this.#authStore.isLoggedInAsAdmin;
  protected readonly users = this.#userStore.users;

  protected readonly columns: Column[] = [
    {
      key: 'name',
      name: 'Name',
      width: '400px',
      type: 'sort',
      position: 'left',
      sortDefault: true,
    },
    {
      key: 'email',
      name: 'Email',
      width: '400px',
      type: 'sort',
      position: 'left',
    },
    {
      key: 'role',
      name: 'Role',
      width: '150px',
      type: 'sort',
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

  protected deleteUser(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this user?',
      body: 'All information associated to this path will be permanently deleted.',
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
    await this.#userStore.delete(id);
  }

  protected editUser(id: number) {
    this.#router.navigate(['/admin/users', id]);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../../shared/services/auth/auth-service';
import { Column } from '../../shared/models/column-interface';
import { DeleteModal } from '../../shared/modals/delete-modal';
import { DisplayTable } from '../../shared/components/display-table';
import { ModalService } from '../../shared/modals/modal-service';
import { UserData } from '../../shared/services/user/user-data';

@Component({
  selector: 'app-user-list',
  imports: [DisplayTable],
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
export default class UserList {
  readonly #authStore = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalService);
  readonly #router = inject(Router);
  readonly #userStore = inject(UserData);

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
    await this.#userStore.delete(id);
  }

  protected editUser(id: number) {
    this.#router.navigate(['/admin/users', id]);
  }
}

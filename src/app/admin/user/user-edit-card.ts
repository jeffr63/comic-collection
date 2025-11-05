import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Field, FieldTree, ValidationError } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { User } from '../../shared/models/user-interface';
import { toErrorMessages } from '../../shared/services/common/error-service';

@Component({
  selector: 'app-user-edit-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    Field,
    RouterLink,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>User Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            <mat-form-field appearance="outline">
              <mat-label for="name">Name</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="name"
                matInput
                [field]="form().name"
                placeholder="Enter name of user" />
              @let fname = form().name();
              <!-- name required error -->
              @if (fname.invalid() && fname.touched()) {
                <mat-error>{{ generateErrors(fname.errors()) }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="email">Email</mat-label>
              <input type="text" id="email" matInput [field]="form().email" placeholder="Enter email of user" />
              @let femail = form().email();
              <!-- email required error -->
              @if (femail.invalid() && femail.touched()) {
                <mat-error>{{ generateErrors(femail.errors()) }}</mat-error>
              }
            </mat-form-field>

            <label id="role">Role</label>
            <mat-radio-group aria-labelledby="Role" class="radio-group" id="role" [field]="form().role">
              <mat-radio-button class="radio-button" value="admin">Admin</mat-radio-button>
              <mat-radio-button class="radio-button" value="user">User</mat-radio-button>
            </mat-radio-group>
            @let frole = form().role();
            <!-- role required error -->
            @if (frole.invalid() && frole.touched()) {
              <mat-error> Role is required </mat-error>
            }
          </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="form()().invalid()">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" routerLink="/admin/users">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    mat-card {
      margin: 30px;
      padding-left: 15px;
      padding-right: 15px;
      width: 30%;
    }

    mat-content {
      width: 100%;
    }

    mat-form-field {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .ml-10 {
      margin-left: 10px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
      align-items: flex-start;
    }

    .radio-button {
      margin: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditCard {
  form = input.required<FieldTree<User>>();
  save = output();

  generateErrors(errors: ValidationError[]) {
    return toErrorMessages(errors);
  }
}

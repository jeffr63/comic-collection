import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { User } from '../../shared/models/user-interface';
import { ValidationErrors } from '../../shared/components/validation-errors';

@Component({
  selector: 'app-user-edit-card',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    // MatRadio,
    // MatRadioGroup,
    Field,
    RouterLink,
    ValidationErrors,
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
                <app-validation-errors matError [errors]="fname.errors()" />
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="email">Email</mat-label>
              <input type="text" id="email" matInput [field]="form().email" placeholder="Enter email of user" />
              @let femail = form().email();
              <!-- email required error -->
              @if (femail.invalid() && femail.touched()) {
                <app-validation-errors matError [errors]="femail.errors()" />
              }
            </mat-form-field>

            <label id="role">Role</label>
            <!-- <mat-radio-group aria-labelledby="Role" class="radio-group" id="role" [field]="form().userrole">
              <mat-radio-button class="radio-button" value="admin">Admin</mat-radio-button>
              <mat-radio-button class="radio-button" value="user">User</mat-radio-button>
            </mat-radio-group>
            <label> -->
            <div class="radio-group">
              <label>
                <input type="radio" value="admin" [field]="form().userrole" />
                Admin
              </label>
              <label>
                <input type="radio" value="user" [field]="form().userrole" />
                User
              </label>
            </div>
            @let frole = form().userrole();
            <!-- role required error -->
            @if (frole.invalid() && frole.touched()) {
              <app-validation-errors matError [errors]="frole.errors()" />
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
}

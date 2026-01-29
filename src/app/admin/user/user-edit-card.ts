import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormField, FieldTree, ValidationError } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { User } from '../../shared/models/user-interface';
import * as validation from '../../shared/services/common/validatation-error';

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
    FormField,
    RouterLink,
    MatError,
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
                [formField]="form().name"
                placeholder="Enter name of user" />
              @let fname = form().name();
              @if (fname.invalid() && fname.touched()) {
                <mat-error>
                  @for (error of fname.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="email">Email</mat-label>
              <input type="text" id="email" matInput [formField]="form().email" placeholder="Enter email of user" />
              @let femail = form().email();
              @if (femail.invalid() && femail.touched()) {
                <mat-error>
                  @for (error of femail.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <label id="role">Role</label>
            <div class="radio-group">
              <label>
                <input type="radio" value="admin" [formField]="form().userrole" />
                Admin
              </label>
              <label>
                <input type="radio" value="user" [formField]="form().userrole" />
                User
              </label>
            </div>
            @let frole = form().userrole();
            @if (frole.invalid() && frole.touched()) {
              <mat-error>
                @for (error of frole.errors(); track error.kind) {
                  {{ getError(error) }}
                }
              </mat-error>
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

  getError(error: ValidationError) {
    return validation.getError(error);
  }
}

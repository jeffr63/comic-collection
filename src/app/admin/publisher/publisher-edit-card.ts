import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Field, FieldTree, ValidationError } from '@angular/forms/signals';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { Publisher } from '../../shared/models/publisher-interface';
import { toErrorMessages } from '../../shared/services/common/error-service';

@Component({
  selector: 'app-publisher-edit-card',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    Field,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Publisher Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            <mat-form-field appearance="outline">
              <mat-label for="name">Publisher Name</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="title"
                matInput
                [field]="form().name"
                placeholder="Enter name of publisher" />
              @if (form().name().errors() && form().name().touched()) {
                <mat-error>{{ generateErrors(form().name().errors()) }}</mat-error>
              }
            </mat-form-field>
          </form>
        }
      </mat-card-content>

      @let invalid = form()().invalid;
      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="invalid()">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="warn" (click)="saveNew.emit()" title="Save" [disabled]="invalid()" class="ml-10">
          <mat-icon>add_task</mat-icon> Save & New
        </button>
        <button mat-flat-button color="accent" class="ml-10" (click)="cancel.emit()">
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublisherEditCard {
  form = input.required<FieldTree<Publisher>>();
  cancel = output();
  save = output();
  saveNew = output();

  generateErrors(errors: ValidationError[]) {
    return toErrorMessages(errors);
  }
}

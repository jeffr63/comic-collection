import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormField, FieldTree, ValidationError } from '@angular/forms/signals';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Publisher } from '../../shared/models/publisher-interface';
import { Title } from '../../shared/models/title-interface';
import * as validation from '../../shared/services/common/validatation-error';

@Component({
  selector: 'app-title-edit-card',
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormField,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Title Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            @if (filteredPublishers()) {
              <mat-form-field appearance="outline">
                <mat-label>Publisher</mat-label>
                <input
                  matInput
                  id="publisher"
                  #inputPublisher
                  [formField]="form().publisher"
                  [matAutocomplete]="publisherAuto"
                  (keyup)="onAutocompleteKeyUp.emit(inputPublisher.value)" />
                <mat-autocomplete #publisherAuto="matAutocomplete" autoActiveFirstOption>
                  @for (publisher of filteredPublishers(); track publisher.id) {
                    <mat-option [value]="publisher.name">
                      {{ publisher.name }}
                    </mat-option>
                  }
                </mat-autocomplete>
                <button
                  mat-icon-button
                  matIconSuffix
                  color="primary"
                  routerLink="/admin/publisher/new"
                  title="Add new publisher">
                  <mat-icon>add</mat-icon>
                </button>

                @let fpub = form().publisher();
                @if (fpub.invalid() && fpub.touched()) {
                  <mat-error>
                    @for (error of fpub.errors(); track error.kind) {
                      {{ getError(error) }}
                    }
                  </mat-error>
                }
              </mat-form-field>
            }

            <mat-form-field appearance="outline">
              <mat-label for="title">Title</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="title"
                matInput
                [formField]="form().title"
                placeholder="Enter title of comic" />
              @let ftitle = form().title();
              @if (ftitle.invalid() && ftitle.touched()) {
                <mat-error>
                  @for (error of ftitle.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>
          </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        @let disabled = form()().invalid();
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="disabled">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="warn" (click)="saveNew.emit()" title="Save" [disabled]="disabled" class="ml-10">
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
      width: 35%;
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
export class TitleEditCard {
  form = input.required<FieldTree<Title>>();
  filteredPublishers = input.required<Publisher[]>();
  cancel = output();
  save = output();
  saveNew = output();
  onAutocompleteKeyUp = output<string>();

  getError(error: ValidationError) {
    return validation.getError(error);
  }
}

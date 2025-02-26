import { Component, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Publisher } from '../../shared/models/publisher';

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
    ReactiveFormsModule,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Title Edit</mat-card-title>
      <mat-card-content>
        @if (titleEditForm) {
        <form [formGroup]="titleEditForm()">
          @if (filteredPublishers()) {
          <mat-form-field appearance="outline">
            <mat-label>Publisher</mat-label>
            <input
              matInput
              id="publisher"
              #inputPublisher
              formControlName="publisher"
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

            @let fname = titleEditForm().controls.publisher;
            <!-- publisher required error -->
            @if (fname.errors?.['required'] && fname.touched) {
            <mat-error> Publisher is required </mat-error>
            }
            <!-- select publisher from list error -->
            @if (fname.errors?.['match']) {
            <mat-error> Please select a publisher from the list. </mat-error>
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
              formControlName="title"
              placeholder="Enter title of comic" />
            @let ftitle = titleEditForm().controls.title;
            <!-- title required error -->
            @if (ftitle.errors?.['required'] && ftitle.touched) {
            <mat-error> Title is required</mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        @let disabled = !titleEditForm().valid;
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
})
export class TitleEditCardComponent {
  titleEditForm = model.required<FormGroup>();
  filteredPublishers = input.required<Publisher[]>();
  cancel = output();
  save = output();
  saveNew = output();
  onAutocompleteKeyUp = output<string>();
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormField, FieldTree, ValidationError } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Publisher } from '../shared/models/publisher-interface';
import { Title } from '../shared/models/title-interface';
import { Issue } from '../shared/models/issue-interface';
import * as validation from '../shared/services/common/validatation-error';

@Component({
  selector: 'app-isssue-edit-card',
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    FormField,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Issue Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            <!-- publishers dropdown -->
            @if (filteredPublishers()) {
              <mat-form-field appearance="outline">
                <mat-label for="publisher">Publisher</mat-label>
                <input
                  matInput
                  id="publisher"
                  #inputPublisher
                  [formField]="form().publisher"
                  [matAutocomplete]="publisherAuto"
                  (keyup)="onAutocompleteKeyUpPublisher.emit(inputPublisher.value)" />
                <mat-autocomplete #publisherAuto="matAutocomplete" autoActiveFirstOption>
                  @for (publisher of filteredPublishers(); track publisher.id) {
                    <mat-option [value]="publisher.name">
                      {{ publisher.name }}
                    </mat-option>
                  }
                </mat-autocomplete>
                @let fpublisher = form().publisher();
                @if (fpublisher.invalid() && fpublisher.touched()) {
                  <mat-error>
                    @for (error of fpublisher.errors(); track error.kind) {
                      {{ getError(error) }}
                    }
                  </mat-error>
                }
              </mat-form-field>
            }

            <!-- titles dropdown -->
            @if (filteredTitles()) {
              <mat-form-field appearance="outline">
                <mat-label for="title">Title</mat-label>
                <input
                  matInput
                  id="title"
                  #inputTitle
                  [formField]="form().title"
                  [matAutocomplete]="titleAuto"
                  (keyup)="onAutocompleteKeyUpTitle.emit(inputTitle.value)" />
                <mat-autocomplete #titleAuto="matAutocomplete" autoActiveFirstOption>
                  @for (title of filteredTitles(); track title.id) {
                    <mat-option [value]="title.title">
                      {{ title.title }}
                    </mat-option>
                  }
                </mat-autocomplete>
                <button
                  mat-icon-button
                  matIconSuffix
                  color="primary"
                  routerLink="/admin/title/new"
                  title="Add new title">
                  <mat-icon>add</mat-icon>
                </button>
                @let ftitle = form().title();
                @if (ftitle.invalid() && ftitle.touched()) {
                  <mat-error>
                    @for (error of ftitle.errors(); track error.kind) {
                      {{ getError(error) }}
                    }
                  </mat-error>
                }
              </mat-form-field>
            }

            <mat-form-field appearance="outline">
              <mat-label for="issue">Issue Number</mat-label>
              <input
                ngbAutofocus
                type="number"
                id="issue"
                matInput
                [formField]="form().issue"
                placeholder="Enter issue number of comic" />
              @let fissue = form().issue();
              @if (fissue.invalid() && fissue.touched()) {
                <mat-error>
                  @for (error of fissue.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="coverPrice">Cover Price</mat-label>
              <input
                ngbAutofocus
                type="number"
                id="coverPrice"
                matInput
                [formField]="form().coverPrice"
                placeholder="Enter cover price of comic" />
              @let fcoverPrice = form().coverPrice();
              @if (fcoverPrice.invalid() && fcoverPrice.touched()) {
                <mat-error>
                  @for (error of fcoverPrice.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="url">Url</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="url"
                matInput
                formControlName="url"
                placeholder="Enter url to comic page" />
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
        <button mat-flat-button color="accent" (click)="cancel.emit()" class="ml-10">
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
      width: 40%;
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
export class IsssueEditCard {
  form = input.required<FieldTree<Issue>>();
  filteredPublishers = input.required<Publisher[]>();
  filteredTitles = input.required<Title[]>();
  cancel = output();
  onAutocompleteKeyUpPublisher = output<string>();
  onAutocompleteKeyUpTitle = output<string>();
  save = output();
  saveNew = output();

  getError(error: ValidationError) {
    return validation.getError(error);
  }
}

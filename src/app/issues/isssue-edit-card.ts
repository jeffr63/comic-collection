import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
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
import { ValidationErrors } from '../shared/components/validation-errors';

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
    Field,
    ValidationErrors,
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
                  [field]="form().publisher"
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
                <!-- publisher required error  -->
                @if (fpublisher.invalid() && fpublisher.touched()) {
                  <app-validation-errors matError [errors]="fpublisher.errors()" />
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
                  [field]="form().title"
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
                <!-- title required error -->
                @if (ftitle.invalid() && ftitle.touched()) {
                  <app-validation-errors matError [errors]="ftitle.errors()" />
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
                [field]="form().issue"
                placeholder="Enter issue number of comic" />
              @let fissue = form().issue();
              <!-- issue required error -->
              @if (fissue.invalid() && fissue.touched()) {
                <app-validation-errors matError [errors]="fissue.errors()" />
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="coverPrice">Cover Price</mat-label>
              <input
                ngbAutofocus
                type="number"
                id="coverPrice"
                matInput
                [field]="form().coverPrice"
                placeholder="Enter cover price of comic" />
              @let fcoverPrice = form().coverPrice();
              <!-- cover price required error -->
              @if (fcoverPrice.invalid() && fcoverPrice.touched()) {
                <app-validation-errors matError [errors]="fcoverPrice.errors()" />
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
}

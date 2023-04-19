import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AsyncPipe, Location, NgForOf, NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import * as _ from 'lodash';

import { Title } from '../models/title';
import { TitleService } from '../services/title.service';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';

@Component({
  selector: 'app-title-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
  ],

  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Title Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="titleEditForm" [formGroup]="titleEditForm">
          <mat-form-field appearance="outline" *ngIf="this.publisherService.publishers() as publishers">
            <mat-label>Publisher</mat-label>
            <input
              matInput
              id="publisher"
              #inputPublisher
              formControlName="publisher"
              [matAutocomplete]="publisherAuto"
              (keyup)="onAutocompleteKeyUp(inputPublisher.value, this.publisherService.publishers())"
            />
            <mat-autocomplete #publisherAuto="matAutocomplete" autoActiveFirstOption>
              <mat-option *ngFor="let publisher of filteredPublishers()" [value]="publisher.name">
                {{ publisher.name }}
              </mat-option>
            </mat-autocomplete>
            <button
              mat-icon-button
              matIconSuffix
              color="primary"
              [routerLink]="['/admin/publisher/new']"
              title="Add new publisher"
            >
              <mat-icon>add</mat-icon>
            </button>
            <mat-error
              *ngIf="
                titleEditForm.controls['publisher']?.errors?.['required'] &&
                titleEditForm.controls['publisher']?.touched
              "
            >
              Publisher is required
            </mat-error>
            <mat-error *ngIf="titleEditForm.controls['publisher'].errors?.['match']">
              Please select a publisher from the list.
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="title">Title</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="title"
              placeholder="Enter title of comic"
            />
            <mat-error
              *ngIf="titleEditForm.controls['title'].errors?.['required'] && titleEditForm.controls['title']?.touched"
            >
              Title is required
            </mat-error>
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!titleEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button
          mat-flat-button
          color="warn"
          (click)="saveNew()"
          title="Save"
          [disabled]="!titleEditForm.valid"
          class="ml-10"
        >
          <mat-icon>add_task</mat-icon> Save & New
        </button>
        <button mat-flat-button color="accent" class="ml-10" (click)="cancel()">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
      /* TODO(mdc-migration): The following rule targets internal classes of card that may no longer apply for the MDC version. */
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
  ],
})
export default class TitleEditComponent implements OnInit {
  route = inject(ActivatedRoute);
  location = inject(Location);
  titleService = inject(TitleService);
  fb = inject(FormBuilder);
  publisherService = inject(PublisherService);

  titleEditForm!: FormGroup;
  filteredPublishers = signal<Publisher[]>([]);
  private title = <Title>{};
  isNew = true;

  async ngOnInit() {
    this.titleEditForm = this.fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringValidator()]],
      title: ['', Validators.required],
    });

    await this.publisherService.getAll();
    const sorted = _.orderBy(this.publisherService.publishers(), 'name', 'asc');
    this.filteredPublishers.set(sorted);

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'new' && id != null) {
      this.isNew = false;
      this.loadFormValues(parseInt(id));
    }
  }

  async loadFormValues(id: number) {
    const title = await this.titleService.getById(id);
    this.title = title;
    this.titleEditForm.get('publisher')?.setValue(title.publisher);
    this.titleEditForm.get('title')?.setValue(title.title);
  }

  cancel() {
    this.location.back();
  }

  getAutoCompleteDisplayValue(option: string): string {
    return option;
  }

  onAutocompleteKeyUp(searchText: string, options: Publisher[]): void {
    const lowerSearchText = searchText?.toLowerCase();
    this.filteredPublishers.set(
      !lowerSearchText ? options : options.filter((r) => r.name.toLocaleLowerCase().startsWith(lowerSearchText))
    );
  }

  save() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.title.publisher = publisher;
    this.title.title = title;

    if (this.isNew) {
      this.titleService.add(this.title);
    } else {
      this.titleService.update(this.title);
    }
    this.location.back();
  }

  saveNew() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.title.publisher = publisher;
    this.title.title = title;
    if (this.isNew) {
      this.titleService.add(this.title);
    } else {
      this.titleService.update(this.title);
    }

    this.titleEditForm.patchValue({
      publisher: publisher,
      title: title,
    });

    // create new title object and set publisher
    this.title = {
      publisher: publisher,
      title: '',
    };

    this.titleEditForm.patchValue({
      publisher: this.title.publisher,
      title: this.title.title,
    });
  }

  autocompleteStringValidator(): ValidatorFn {
    let selectedItem!: Publisher | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === '') {
        return null;
      }
      selectedItem = this.publisherService
        .publishers()
        .find((publisher: Publisher) => publisher.name === control.value);
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return { match: { value: control.value } };
    };
  }
}

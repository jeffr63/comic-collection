import { Component, OnInit, inject, input, linkedSignal, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Publisher } from '../shared/models/publisher';
import { PublisherFacade } from '../shared/facades/publisher.facade';
import { Title } from '../shared/models/title';
import { TitleFacade } from '../shared/facades/title.facade';

@Component({
  selector: 'app-title-edit',
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Title Edit</mat-card-title>
      <mat-card-content>
        @if (titleEditForm) {
        <form [formGroup]="titleEditForm">
          @if (publishers()) {
          <mat-form-field appearance="outline">
            <mat-label>Publisher</mat-label>
            <input
              matInput
              id="publisher"
              #inputPublisher
              formControlName="publisher"
              [matAutocomplete]="publisherAuto"
              (keyup)="onAutocompleteKeyUp(inputPublisher.value, publishers())" />
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

            @let fname = titleEditForm.controls.publisher;
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
            @let ftitle = titleEditForm.controls.title;
            <!-- title required error -->
            @if (ftitle.errors?.['required'] && ftitle.touched) {
            <mat-error> Title is required</mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        @let disabled = !titleEditForm.valid;
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="disabled">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="warn" (click)="saveNew()" title="Save" [disabled]="disabled" class="ml-10">
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
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherFacade);
  readonly #titleStore = inject(TitleFacade);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);
  protected readonly publisherFilter = signal<string>('');
  protected readonly publishers = this.#publisherStore.sortedPublishers;
  protected readonly filteredPublishers = linkedSignal({
    source: () => {
      this.publishers(), this.publisherFilter();
    },
    computation: () => {
      return this.publisherFilter() == ''
        ? this.publishers()
        : this.publishers().filter((r) => r.name.toLocaleLowerCase().startsWith(this.publisherFilter()));
    },
  });
  readonly #title = resource<Title, string>({
    request: this.id,
    loader: async ({ request: id }) => {
      if (id === 'new') return { publisher: '', title: '' };
      const title = await this.#titleStore.getById(+id);
      this.loadFormValues(title);
      return title;
    },
  });
  protected titleEditForm!: FormGroup;

  async ngOnInit() {
    this.titleEditForm = this.#fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringValidator()]],
      title: ['', Validators.required],
    });
    if (this.id() !== 'new' && this.id() != undefined) {
      this.#isNew.set(false);
    }
  }

  private loadFormValues(title: Title) {
    this.titleEditForm.get('publisher')?.setValue(title.publisher);
    this.titleEditForm.get('title')?.setValue(title.title);
  }

  protected cancel() {
    this.#location.back();
  }

  protected onAutocompleteKeyUp(searchText: string, options: Publisher[]): void {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected save() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.#title.value().publisher = publisher;
    this.#title.value().title = title;

    if (this.#isNew) {
      this.#titleStore.add(this.#title.value());
    } else {
      this.#titleStore.update(this.#title.value());
    }
    this.#location.back();
  }

  protected saveNew() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.#title.value().publisher = publisher;
    this.#title.value().title = title;
    if (this.#isNew) {
      this.#titleStore.add(this.#title.value());
    } else {
      this.#titleStore.update(this.#title.value());
    }

    this.titleEditForm.patchValue({
      publisher: publisher,
      title: title,
    });

    // create new title object and set publisher
    this.#title.set({ publisher: publisher, title: '' });
    this.titleEditForm.patchValue({ publisher: this.#title.value().publisher, title: '' });
    this.#isNew.set(true);
  }

  private autocompleteStringValidator(): ValidatorFn {
    let selectedItem!: Publisher | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === '') {
        return null;
      }
      selectedItem = this.publishers().find((publisher: Publisher) => publisher.name === control.value);
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return { match: { value: control.value } };
    };
  }
}

import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AsyncPipe, Location } from '@angular/common';
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

  protected readonly publishers = this.#publisherStore.publishers;
  protected readonly filteredPublishers = signal<Publisher[]>([]);
  #isNew = true;
  #title = <Title>{};
  protected titleEditForm!: FormGroup;

  async ngOnInit() {
    this.titleEditForm = this.#fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringValidator()]],
      title: ['', Validators.required],
    });

    if (this.publishers().length === 0) {
      await this.#publisherStore.getAll();
    }
    let sorted = [...this.publishers()];
    sorted.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    this.filteredPublishers.set(sorted);

    if (this.id() !== 'new' && this.id() != undefined) {
      this.#isNew = false;
      this.loadFormValues(+this.id());
    }
  }

  private async loadFormValues(id: number) {
    const title = await this.#titleStore.getById(id);
    this.#title = title;
    this.titleEditForm.get('publisher')?.setValue(title.publisher);
    this.titleEditForm.get('title')?.setValue(title.title);
  }

  protected cancel() {
    this.#location.back();
  }

  private getAutoCompleteDisplayValue(option: string): string {
    return option;
  }

  protected onAutocompleteKeyUp(searchText: string, options: Publisher[]): void {
    const lowerSearchText = searchText?.toLowerCase();
    this.filteredPublishers.set(
      !lowerSearchText ? options : options.filter((r) => r.name.toLocaleLowerCase().startsWith(lowerSearchText))
    );
  }

  protected save() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.#title.publisher = publisher;
    this.#title.title = title;

    if (this.#isNew) {
      this.#titleStore.add(this.#title);
    } else {
      this.#titleStore.update(this.#title);
    }
    this.#location.back();
  }

  protected saveNew() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.#title.publisher = publisher;
    this.#title.title = title;
    if (this.#isNew) {
      this.#titleStore.add(this.#title);
    } else {
      this.#titleStore.update(this.#title);
    }

    this.titleEditForm.patchValue({
      publisher: publisher,
      title: title,
    });

    // create new title object and set publisher
    this.#title = {
      publisher: publisher,
      title: '',
    };

    this.titleEditForm.patchValue({
      publisher: this.#title.publisher,
      title: this.#title.title,
    });
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

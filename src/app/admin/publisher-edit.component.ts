import { Component, OnInit, inject, input, resource, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Publisher } from '../shared/models/publisher';
import { PublisherFacade } from '../shared/facades/publisher.facade';

@Component({
  selector: 'app-publisher-edit',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Publisher Edit</mat-card-title>
      <mat-card-content>
        @if (publisherEditForm) {
        <form [formGroup]="publisherEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Publisher Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of publisher" />
            @let fname = publisherEditForm.controls.name;
            <!-- publisher required error -->
            @if (fname.errors?.required && fname.touched) {
            <mat-error> Publisher name is required </mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!publisherEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button
          mat-flat-button
          color="warn"
          (click)="saveNew()"
          title="Save"
          [disabled]="!publisherEditForm.valid"
          class="ml-10">
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
  ],
})
export default class PublisherEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherFacade);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);
  readonly #publisher = resource<Publisher, string>({
    request: this.id,
    loader: async ({ request: id }) => {
      if (id === 'new') return { name: '' };
      const publisher = await this.#publisherStore.getById(+id);
      this.loadFormValues(publisher);
      return publisher;
    },
  });
  protected publisherEditForm!: FormGroup;

  ngOnInit() {
    this.publisherEditForm = this.#fb.group({ name: ['', Validators.required] });
    if (this.id() !== 'new' || this.id() == undefined) {
      this.#isNew.set(false);
    }
  }

  protected loadFormValues(publisher: Publisher) {
    this.publisherEditForm?.get('name')?.setValue(publisher.name);
  }

  protected save() {
    this.#publisher.value().name = this.publisherEditForm.controls['name'].value;
    if (this.#isNew()) {
      this.#publisherStore.add(this.#publisher.value());
    } else {
      this.#publisherStore.update(this.#publisher.value());
    }
    this.#location.back();
  }

  protected cancel() {
    this.#location.back();
  }

  protected saveNew() {
    this.#publisher.value().name = this.publisherEditForm.controls['name'].value;
    if (this.#isNew()) {
      this.#publisherStore.add(this.#publisher.value());
    } else {
      this.#publisherStore.update(this.#publisher.value());
    }

    // clear publisher object, clear form object, reset flag to new
    this.#publisher.set({ name: '' });
    this.publisherEditForm.patchValue({ name: '' });
    this.#isNew.set(true);
  }
}

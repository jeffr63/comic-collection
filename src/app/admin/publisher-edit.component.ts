import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],

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

  #isNew = true;
  #publisher = <Publisher>{};
  protected publisherEditForm!: FormGroup;

  ngOnInit() {
    this.publisherEditForm = this.#fb.group({
      name: ['', Validators.required],
    });

    if (this.id() !== 'new' && this.id() != undefined) {
      this.#isNew = false;
      this.loadFormValues(+this.id());
    }
  }

  protected async loadFormValues(id: number) {
    const publisher = await this.#publisherStore.getById(id);
    this.#publisher = publisher;
    this.publisherEditForm?.get('name')?.setValue(publisher.name);
  }

  protected save() {
    this.#publisher.name = this.publisherEditForm.controls['name'].value;
    if (this.#isNew) {
      this.#publisherStore.add(this.#publisher);
    } else {
      this.#publisherStore.update(this.#publisher);
    }
    this.#location.back();
  }

  protected cancel() {
    this.#location.back();
  }

  private saveNew() {
    this.#publisher.name = this.publisherEditForm.controls['name'].value;
    if (this.#isNew) {
      this.#publisherStore.add(this.#publisher);
    } else {
      this.#publisherStore.update(this.#publisher);
    }

    // create new publisher object and set publisher name to blank
    this.#publisher = {
      name: '',
    };
    this.publisherEditForm.patchValue({
      publisher: this.#publisher.name,
    });
  }
}

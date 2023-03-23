import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';

@Component({
  selector: 'app-publisher-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
  ],

  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Publisher Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="publisherEditForm" [formGroup]="publisherEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Publisher Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of publisher"
            />
            <mat-error
              *ngIf="
                publisherEditForm.controls['name']?.errors?.['required'] &&
                publisherEditForm.controls['name']?.touched
              "
            >
              Publisher name is required
            </mat-error>
          </mat-form-field>
        </form>
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
  route = inject(ActivatedRoute);
  location = inject(Location);
  publisherService = inject(PublisherService);
  fb = inject(FormBuilder);

  publisherEditForm!: FormGroup;
  private publisher = <Publisher>{};
  private isNew = true;

  ngOnInit() {
    this.publisherEditForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.route.params.subscribe((params) => {
      if (params['id'] !== 'new') {
        this.isNew = false;
        this.loadFormValues(params['id']);
      }
    });
  }

  async loadFormValues(id: number) {
    const publisher = (await this.publisherService.getById(id)) as unknown as Publisher;
    this.publisher = publisher;
    this.publisherEditForm?.get('name')?.setValue(publisher.name);
  }

  save() {
    this.publisher.name = this.publisherEditForm.controls['name'].value;
    if (this.isNew) {
      this.publisherService.add(this.publisher);
    } else {
      this.publisherService.update(this.publisher);
    }
    this.location.back();
  }

  cancel() {
    this.location.back();
  }

  saveNew() {
    this.publisher.name = this.publisherEditForm.controls['name'].value;
    if (this.isNew) {
      this.publisherService.add(this.publisher);
    } else {
      this.publisherService.update(this.publisher);
    }

    // create new publisher object and set publisher name to blank
    this.publisher = {
      name: '',
    };
    this.publisherEditForm.patchValue({
      publisher: this.publisher.name,
    });
  }
}

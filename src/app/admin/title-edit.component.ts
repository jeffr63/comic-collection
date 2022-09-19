import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, Location, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Observable, Subject, takeUntil } from 'rxjs';

import { Title } from '../models/title';
import { TitleService } from '../services/title.service';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-title-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLinkWithHref,
  ],

  template: `
    <mat-card>
      <mat-card-title>Title Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="titleEditForm" [formGroup]="titleEditForm">
          <mat-form-field appearance="outline">
            <mat-label>Publisher</mat-label>
            <mat-select id="publisher" formControlName="publisher">
              <mat-option
                *ngFor="let publisher of publishers$ | async"
                [value]="publisher.name"
              >
                {{ publisher.name }}
              </mat-option>
            </mat-select>
            <mat-error
              *ngIf="
                titleEditForm.controls['publisher']?.errors?.['required'] &&
                titleEditForm.controls['publisher']?.touched
              "
            >
              Publisher is required
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
        <button
          mat-flat-button
          color="primary"
          (click)="save()"
          title="Save"
          [disabled]="!titleEditForm.valid"
        >
          <mat-icon>save</mat-icon> Save
        </button>
        <a
          mat-flat-button
          color="accent"
          class="ml-10"
          [routerLink]="['/admin/titles']"
          ><mat-icon>cancel</mat-icon> Cancel</a
        >
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
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
export class TitleEditComponent implements OnInit, OnDestroy {
  componentActive = true;
  titleEditForm!: FormGroup;
  publishers$!: Observable<Publisher[]>;
  private title = <Title>{};
  private isNew = true;
  componentIsDestroyed = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private titleService: TitleService,
    private fb: FormBuilder,
    private publisherService: PublisherService
  ) {}

  ngOnInit() {
    this.titleEditForm = this.fb.group({
      publisher: ['', Validators.required],
      title: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      if (params['id'] !== 'new') {
        this.isNew = false;
        this.loadFormValues(params['id']);
      }
    });

    this.publisherService.getAll();
    this.publishers$ = this.publisherService.entities$;
  }

  ngOnDestroy() {
    this.componentActive = false;
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  loadFormValues(id: number) {
    this.titleService
      .getByKey(id)
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe((title: Title) => {
        this.title = { ...title };
        this.titleEditForm.get('publisher')?.setValue(this.title.publisher);
        this.titleEditForm.get('title')?.setValue(this.title.title);
      });
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
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, Location, NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { Observable, Subject, takeUntil } from 'rxjs';

import { Issue } from '../models/issue';
import { IssueService } from './issue.service';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-issue-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLinkWithHref,
  ],

  template: `
    <mat-card>
      <mat-card-title>Course Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="issueEditForm" [formGroup]="issueEditForm">
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
                issueEditForm.controls['publisher']?.errors?.['required'] &&
                issueEditForm.controls['publisher']?.touched
              "
            >
              Publisher is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <mat-select id="title" formControlName="title">
              <mat-option
                *ngFor="let title of titles$ | async"
                [value]="title.title"
              >
                {{ title.title }}
              </mat-option>
            </mat-select>
            <mat-error
              *ngIf="
                issueEditForm.controls['title']?.errors?.['required'] &&
                issueEditForm.controls['title']?.touched
              "
            >
              Title is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="issue">Issue Number</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="issue"
              matInput
              formControlName="issue"
              placeholder="Enter issue number of comic"
            />
            <mat-error
              *ngIf="
                issueEditForm.controls['issue']?.errors?.['required'] &&
                issueEditForm.controls['issue']?.touched
              "
            >
              Issue Number is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="coverPrice">Cover Price</mat-label>
            <input
              ngbAutofocus
              type="number"
              id="coverPrice"
              matInput
              formControlName="coverPrice"
              placeholder="Enter cover price of comic"
            />
            <mat-error
              *ngIf="
                issueEditForm.controls['coverPrice']?.errors?.['required'] &&
                issueEditForm.controls['coverPrice']?.touched
              "
            >
              Cover Price is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="issue">Includes</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="includes"
              matInput
              formControlName="includes"
              placeholder="Enter other major characters included in comic"
            />
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button
          mat-flat-button
          color="primary"
          (click)="save()"
          title="Save"
          [disabled]="!issueEditForm.valid"
        >
          <mat-icon>save</mat-icon> Save
        </button>
        <a
          mat-flat-button
          color="accent"
          class="ml-10"
          [routerLink]="['/courses']"
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
export class IssueEditComponent implements OnInit, OnDestroy {
  loading = false;
  componentActive = true;
  publishers$!: Observable<Publisher[]>;
  titles$!: Observable<Title[]>;
  issueEditForm!: FormGroup;
  private issue = <Issue>{};
  private isNew = true;
  private componentIsDestroyed = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private issueService: IssueService,
    private publisherService: PublisherService,
    private titleService: TitleService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.issueEditForm = this.fb.group({
      publisher: ['', Validators.required],
      title: ['', Validators.required],
      issue: ['', Validators.required],
      coverPrice: ['', Validators.required],
      includes: [''],
    });

    this.route.params.subscribe((params) => {
      if (params['id'] !== 'new') {
        this.isNew = false;
        this.loadFormValues(params['id']);
      }
    });

    this.publisherService.getAll();
    this.publishers$ = this.publisherService.entities$;
    this.titleService.getAll();
    this.titles$ = this.titleService.entities$;
  }

  ngOnDestroy() {
    this.componentActive = false;
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  loadFormValues(id: number) {
    this.issueService
      .getByKey(id)
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe((issue: Issue) => {
        this.issue = { ...issue };
        this.issueEditForm.patchValue({
          publisher: issue.publisher,
          title: issue.title,
          issue: issue.issue,
          coverPrice: issue.coverPrice,
          includes: issue.includes,
        });
      });
  }

  save() {
    const { publisher, title, issue, coverPrice, includes } =
      this.issueEditForm.getRawValue();
    this.issue.publisher = publisher;
    this.issue.title = title;
    this.issue.issue = issue;
    this.issue.coverPrice = coverPrice;
    this.issue.includes = includes;

    if (this.isNew) {
      this.issueService.add(this.issue);
    } else {
      this.issueService.update(this.issue);
    }
    this.location.back();
  }
}

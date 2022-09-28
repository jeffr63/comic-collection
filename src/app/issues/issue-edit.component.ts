import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      <mat-card-title>Issue Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="issueEditForm" [formGroup]="issueEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="publisher">Publisher</mat-label>
            <mat-select id="publisher" formControlName="publisher">
              <mat-option *ngFor="let publisher of publishers$ | async" [value]="publisher.name">
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
            <mat-label for="title">Title</mat-label>
            <mat-select id="title" formControlName="title">
              <mat-option *ngFor="let title of titles$ | async" [value]="title.title">
                {{ title.title }}
              </mat-option>
            </mat-select>
            <a mat-flat-button matSuffix color="primary" [routerLink]="['/admin/title/new']" title="Add new title">
              <mat-icon>add</mat-icon>
            </a>
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
            <mat-label for="url">Url</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="url"
              matInput
              formControlName="url"
              placeholder="Enter url to comic page"
            />
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!issueEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button
          mat-flat-button
          color="warn"
          (click)="saveNew()"
          title="Save"
          [disabled]="!issueEditForm.valid"
          class="ml-10"
        >
          <mat-icon>add_task</mat-icon> Save & New
        </button>
        <button mat-flat-button color="accent" (click)="cancel()" class="ml-10">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
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
      url: [''],
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

  cancel() {
    this.location.back();
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
          url: issue.url,
        });
      });
  }

  save() {
    const { publisher, title, issue, coverPrice, url } = this.issueEditForm.getRawValue();
    this.issue.publisher = publisher;
    this.issue.title = title;
    this.issue.issue = issue;
    this.issue.coverPrice = coverPrice;
    this.issue.url = url;

    if (this.isNew) {
      this.issueService.add(this.issue);
    } else {
      this.issueService.update(this.issue);
    }
    this.location.back();
  }

  saveNew() {
    const { publisher, title, issue, coverPrice, url } = this.issueEditForm.getRawValue();
    this.issue.publisher = publisher;
    this.issue.title = title;
    this.issue.issue = issue;
    this.issue.coverPrice = coverPrice;
    this.issue.url = url;

    if (this.isNew) {
      this.issueService.add(this.issue);
    } else {
      this.issueService.update(this.issue);
    }

    // create new issue object and set publisher, title and coverPrice values
    this.issue = {
      publisher: publisher,
      title: title,
      coverPrice: coverPrice,
      url: url,
      id: null,
      issue: null,
    };
    this.issueEditForm.patchValue({
      publisher: this.issue.publisher,
      title: this.issue.title,
      coverPrice: this.issue.coverPrice,
      issue: this.issue.issue,
      url: this.issue.url,
    });
  }
}

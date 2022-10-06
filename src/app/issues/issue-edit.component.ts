import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AsyncPipe, Location, NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { BehaviorSubject, Observable, Subject, take, takeUntil, tap } from 'rxjs';

import { Issue } from '../models/issue';
import { IssueService } from './issue.service';
import { Publisher } from '../models/publisher';
import { PublisherService } from '../services/publisher.service';
import { Title } from '../models/title';
import { TitleService } from '../services/title.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-issue-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
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
          <mat-form-field appearance="outline" *ngIf="publishers$ | async as publishers">
            <mat-label for="publisher">Publisher</mat-label>
            <input
              matInput
              id="publisher"
              #inputPublisher
              formControlName="publisher"
              [matAutocomplete]="publisherAuto"
              (keyup)="onAutocompleteKeyUpPublisher(inputPublisher.value, publishers)"
            />
            <mat-autocomplete #publisherAuto="matAutocomplete" autoActiveFirstOption>
              <mat-option *ngFor="let publisher of filteredPublishers$ | async" [value]="publisher.name">
                {{ publisher.name }}
              </mat-option>
            </mat-autocomplete>
            <mat-error
              *ngIf="
                issueEditForm.controls['publisher']?.errors?.['required'] &&
                issueEditForm.controls['publisher']?.touched
              "
            >
              Publisher is required
            </mat-error>
            <mat-error *ngIf="issueEditForm.controls['publisher'].errors?.['match']">
              Please select a publisher from the list.
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="titles$ | async as titles">
            <mat-label for="title">Title</mat-label>
            <input
              matInput
              id="title"
              #inputTitle
              formControlName="title"
              [matAutocomplete]="titleAuto"
              (keyup)="onAutocompleteKeyUpTitle(inputTitle.value, titles)"
            />
            <mat-autocomplete #titleAuto="matAutocomplete" autoActiveFirstOption>
              <mat-option *ngFor="let title of filteredTitles$ | async" [value]="title.title">
                {{ title.title }}
              </mat-option>
            </mat-autocomplete>
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
            <mat-error *ngIf="issueEditForm.controls['title'].errors?.['match']">
              Please select a title from the list.
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
  filteredPublishers$!: Observable<Publisher[]>;
  private filteredPublisherSubject = new BehaviorSubject<Publisher[]>([]);
  titles$!: Observable<Title[]>;
  filteredTitles$!: Observable<Title[]>;
  private filteredTitleSubject = new BehaviorSubject<Title[]>([]);
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
      publisher: ['', [Validators.required, this.autocompleteStringPublisherValidator()]],
      title: ['', [Validators.required, this.autocompleteStringTitleValidator()]],
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

    this.filteredPublishers$ = this.filteredPublisherSubject.asObservable();

    this.publisherService.getAll();
    this.publishers$ = this.publisherService.entities$.pipe(
      tap((o) => {
        this.filteredPublisherSubject.next(o);
      })
    );

    this.filteredTitles$ = this.filteredTitleSubject.asObservable();

    this.titleService.getAll();
    this.titles$ = this.titleService.entities$.pipe(
      tap((o) => {
        this.filteredTitleSubject.next(o);
      })
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  autocompleteStringPublisherValidator(): ValidatorFn {
    let selectedItem!: Publisher | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log(control.value);
      if (control.value === '') {
        return null;
      }
      this.publisherService.entities$
        .pipe(
          take(1),
          tap((publishers: Publisher[]) => {
            selectedItem = publishers.find((publisher: Publisher) => publisher.name === control.value);
          })
        )
        .subscribe();
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return { match: { value: control.value } };
    };
  }

  autocompleteStringTitleValidator(): ValidatorFn {
    let selectedItem!: Title | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log(control.value);
      if (control.value === '') {
        return null;
      }
      this.titleService.entities$
        .pipe(
          take(1),
          tap((titles: Title[]) => {
            selectedItem = titles.find((title: Title) => title.title === control.value);
          })
        )
        .subscribe();
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return { match: { value: control.value } };
    };
  }

  cancel() {
    this.location.back();
  }

  getAutoCompleteDisplayValue(option: string): string {
    return option;
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

  onAutocompleteKeyUpPublisher(searchText: string, options: Publisher[]): void {
    const lowerSearchText = searchText?.toLowerCase();
    this.filteredPublisherSubject.next(
      !lowerSearchText ? options : options.filter((r) => r.name.toLocaleLowerCase().startsWith(lowerSearchText))
    );
  }

  onAutocompleteKeyUpTitle(searchText: string, options: Title[]): void {
    const lowerSearchText = searchText?.toLowerCase();
    this.filteredTitleSubject.next(
      !lowerSearchText ? options : options.filter((r) => r.title.toLocaleLowerCase().includes(lowerSearchText))
    );
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

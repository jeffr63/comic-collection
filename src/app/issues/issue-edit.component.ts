import { Component, Input, OnInit, inject, signal } from '@angular/core';
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

import { orderBy } from 'lodash';

import { Issue } from '../shared/models/issue';
import { IssueService } from '../shared/services/issue.service';
import { Publisher } from '../shared/models/publisher';
import { PublisherService } from '../shared/services/publisher.service';
import { Title } from '../shared/models/title';
import { TitleService } from '../shared/services/title.service';

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
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Issue Edit</mat-card-title>
      <mat-card-content>
        @if (issueEditForm) {
        <form [formGroup]="issueEditForm">
          @if (publishers()) {
          <mat-form-field appearance="outline">
            <mat-label for="publisher">Publisher</mat-label>
            <input
              matInput
              id="publisher"
              #inputPublisher
              formControlName="publisher"
              [matAutocomplete]="publisherAuto"
              (keyup)="onAutocompleteKeyUpPublisher(inputPublisher.value, publishers())" />
            <mat-autocomplete #publisherAuto="matAutocomplete" autoActiveFirstOption>
              @for (publisher of filteredPublishers(); track publisher.id) {
              <mat-option [value]="publisher.name">
                {{ publisher.name }}
              </mat-option>
              }
            </mat-autocomplete>
            @if (issueEditForm.controls['publisher'].errors?.['required'] &&
            issueEditForm.controls['publisher'].touched) {
            <mat-error> Publisher is required </mat-error>
            } @if (issueEditForm.controls['publisher'].errors?.['match']) {
            <mat-error> Please select a publisher from the list. </mat-error>
            }
          </mat-form-field>
          } @if (titles()) {
          <mat-form-field appearance="outline">
            <mat-label for="title">Title</mat-label>
            <input
              matInput
              id="title"
              #inputTitle
              formControlName="title"
              [matAutocomplete]="titleAuto"
              (keyup)="onAutocompleteKeyUpTitle(inputTitle.value, titles())" />
            <mat-autocomplete #titleAuto="matAutocomplete" autoActiveFirstOption>
              @for (title of filteredTitles(); track title.id) {
              <mat-option [value]="title.title">
                {{ title.title }}
              </mat-option>
              }
            </mat-autocomplete>
            <button mat-icon-button matIconSuffix color="primary" routerLink="/admin/title/new" title="Add new title">
              <mat-icon>add</mat-icon>
            </button>
            @if (issueEditForm.controls['title'].errors?.['required'] && issueEditForm.controls['title'].touched) {
            <mat-error> Title is required </mat-error>
            } @if (issueEditForm.controls['title'].errors?.['match']) {
            <mat-error> Please select a title from the list. </mat-error>
            }
          </mat-form-field>
          }

          <mat-form-field appearance="outline">
            <mat-label for="issue">Issue Number</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="issue"
              matInput
              formControlName="issue"
              placeholder="Enter issue number of comic" />
            @if (issueEditForm.controls['issue'].errors?.['required'] && issueEditForm.controls['issue'].touched) {
            <mat-error> Issue Number is required </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="coverPrice">Cover Price</mat-label>
            <input
              ngbAutofocus
              type="number"
              id="coverPrice"
              matInput
              formControlName="coverPrice"
              placeholder="Enter cover price of comic" />
            @if (issueEditForm.controls['coverPrice'].errors?.['required'] &&
            issueEditForm.controls['coverPrice'].touched) {
            <mat-error> Cover Price is required </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="url">Url</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="url"
              matInput
              formControlName="url"
              placeholder="Enter url to comic page" />
          </mat-form-field>
        </form>
        }
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
          class="ml-10">
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
export default class IssueEditComponent implements OnInit {
  fb = inject(FormBuilder);
  location = inject(Location);
  issueService = inject(IssueService);
  publisherService = inject(PublisherService);
  titleService = inject(TitleService);

  @Input() id?: string;

  filteredPublishers = signal<Publisher[]>([]);
  filteredTitles = signal<Title[]>([]);
  issues = this.issueService.issues;
  isNew = true;
  issueEditForm!: FormGroup;
  private issue = <Issue>{};
  publishers = this.publisherService.publishers;
  titles = this.titleService.titles;

  async ngOnInit() {
    this.issueEditForm = this.fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringPublisherValidator()]],
      title: ['', [Validators.required, this.autocompleteStringTitleValidator()]],
      issue: ['', Validators.required],
      coverPrice: ['', Validators.required],
      url: [''],
    });

    if (this.publishers().length === 0) {
      await this.publisherService.getAll();
    }
    const sortedPublishers = orderBy(this.publishers(), 'name', 'asc');
    this.filteredPublishers.set(sortedPublishers);

    if (this.titles().length === 0) {
      await this.titleService.getAll();
    }
    const sortedTitles = orderBy(this.titles(), 'title', 'asc');
    this.filteredTitles.set(sortedTitles);

    if (this.id !== 'new' && this.id != undefined) {
      this.isNew = false;
      await this.loadFormValues(parseInt(this.id));
    }
  }

  autocompleteStringPublisherValidator(): ValidatorFn {
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

  autocompleteStringTitleValidator(): ValidatorFn {
    let selectedItem!: Title | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === '') {
        return null;
      }
      selectedItem = this.titles().find((title: Title) => title.title === control.value);
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

  async loadFormValues(id: number) {
    const issue = await this.issueService.getById(id);
    this.issue = issue;
    this.issueEditForm.patchValue({
      publisher: issue.publisher,
      title: issue.title,
      issue: issue.issue,
      coverPrice: issue.coverPrice,
      url: issue.url,
    });
  }

  onAutocompleteKeyUpPublisher(searchText: string, options: Publisher[]): void {
    const lowerSearchText = searchText?.toLowerCase();
    this.filteredPublishers.set(
      !lowerSearchText ? options : options.filter((r) => r.name.toLocaleLowerCase().startsWith(lowerSearchText))
    );
  }

  onAutocompleteKeyUpTitle(searchText: string, options: Title[]): void {
    const lowerSearchText = searchText?.toLowerCase();
    this.filteredTitles.set(
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
      //id: null,
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

  public publisherId(index: number, publisher: Publisher) {
    return publisher.id;
  }

  public titleId(index: number, title: Title) {
    return title.id;
  }
}

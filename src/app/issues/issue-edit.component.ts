import { Component, OnInit, computed, inject, input, resource, signal } from '@angular/core';
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

import { Issue } from '../shared/models/issue';
import { IssueFacade } from '../shared/facades/issue.facade';
import { Publisher } from '../shared/models/publisher';
import { PublisherFacade } from '../shared/facades/publisher.facade';
import { Title } from '../shared/models/title';
import { TitleFacade } from '../shared/facades/title.facade';

@Component({
  selector: 'app-issue-edit',
  imports: [
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
          <!-- publishers dropdown -->
          @if (filteredPublishers()) {
          <mat-form-field appearance="outline">
            <mat-label for="publisher">Publisher</mat-label>
            <input
              matInput
              id="publisher"
              #inputPublisher
              formControlName="publisher"
              [matAutocomplete]="publisherAuto"
              (keyup)="onAutocompleteKeyUpPublisher(inputPublisher.value, filteredPublishers())" />
            <mat-autocomplete #publisherAuto="matAutocomplete" autoActiveFirstOption>
              @for (publisher of filteredPublishers(); track publisher.id) {
              <mat-option [value]="publisher.name">
                {{ publisher.name }}
              </mat-option>
              }
            </mat-autocomplete>
            @let fpublisher = issueEditForm.controls.publisher;
            <!-- publisher required error  -->
            @if (fpublisher.errors?.['required'] && fpublisher.touched) {
            <mat-error> Publisher is required </mat-error>
            }
            <!-- select publisher from list error -->
            @if (fpublisher.errors?.['match']) {
            <mat-error> Please select a publisher from the list. </mat-error>
            }
          </mat-form-field>
          }

          <!-- titles dropdown -->
          @if (filteredTitles()) {
          <mat-form-field appearance="outline">
            <mat-label for="title">Title</mat-label>
            <input
              matInput
              id="title"
              #inputTitle
              formControlName="title"
              [matAutocomplete]="titleAuto"
              (keyup)="onAutocompleteKeyUpTitle(inputTitle.value, filteredTitles())" />
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
            @let ftitle = issueEditForm.controls.title;
            <!-- title required error -->
            @if (ftitle.errors?.['required'] && ftitle.touched) {
            <mat-error> Title is required </mat-error>
            }
            <!-- select title from list error -->
            @if (ftitle.errors?.['match']) {
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
            @let fissue = issueEditForm.controls.issue;
            <!-- issue required error -->
            @if (fissue.errors?.['required'] && fissue.touched) {
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
            @let fcoverPrice = issueEditForm.controls.coverPrice;
            <!-- cover price required error -->
            @if (fcoverPrice.errors?.['required'] && fcoverPrice.touched) {
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
        @let disabled = !issueEditForm.valid;
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="disabled">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="warn" (click)="saveNew()" title="Save" [disabled]="disabled" class="ml-10">
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
  readonly #fb = inject(FormBuilder);
  readonly #issueStore = inject(IssueFacade);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherFacade);
  readonly #titleStore = inject(TitleFacade);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);
  readonly #issue = resource<Issue, string>({
    request: this.id,
    loader: async ({ request: id }) => {
      if (id === 'new') return { publisher: '', title: '', issue: null, coverPrice: null, url: '' };
      const issue = await this.#issueStore.getById(+id);
      this.loadFormValues(issue);
      return issue;
    },
  });
  protected readonly publisherFilter = signal('');
  readonly #publishers = this.#publisherStore.sortedPublishers;
  protected readonly filteredPublishers = computed(() => {
    return this.publisherFilter() == ''
      ? this.#publishers()
      : this.#publishers().filter((r) => r.name.toLocaleLowerCase().startsWith(this.publisherFilter()));
  });
  protected readonly titleFilter = signal('');
  readonly #titles = this.#titleStore.sortedTitles;
  protected readonly filteredTitles = computed(() => {
    return this.titleFilter() == ''
      ? this.#titles()
      : this.#titles().filter((r) => r.title.toLocaleLowerCase().startsWith(this.titleFilter()));
  });
  protected issueEditForm!: FormGroup;

  async ngOnInit() {
    this.issueEditForm = this.#fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringPublisherValidator()]],
      title: ['', [Validators.required, this.autocompleteStringTitleValidator()]],
      issue: ['', Validators.required],
      coverPrice: ['', Validators.required],
      url: [''],
    });
    if (this.id() !== 'new' && this.id() != undefined) {
      this.#isNew.set(false);
    }
  }

  private autocompleteStringPublisherValidator(): ValidatorFn {
    let selectedItem!: Publisher | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === '') {
        return null;
      }
      selectedItem = this.#publishers().find((publisher: Publisher) => publisher.name === control.value);
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return { match: { value: control.value } };
    };
  }

  private autocompleteStringTitleValidator(): ValidatorFn {
    let selectedItem!: Title | undefined;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === '') {
        return null;
      }
      selectedItem = this.#titles().find((title: Title) => title.title === control.value);
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return { match: { value: control.value } };
    };
  }

  protected cancel() {
    this.#location.back();
  }

  private async loadFormValues(issue: Issue) {
    this.issueEditForm.patchValue({
      publisher: issue.publisher,
      title: issue.title,
      issue: issue.issue,
      coverPrice: issue.coverPrice,
      url: issue.url,
    });
  }

  protected onAutocompleteKeyUpPublisher(searchText: string, options: Publisher[]): void {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected onAutocompleteKeyUpTitle(searchText: string, options: Title[]): void {
    this.titleFilter.set(searchText?.toLowerCase());
  }

  protected save() {
    const { publisher, title, issue, coverPrice, url } = this.issueEditForm.getRawValue();
    this.#issue.value().publisher = publisher;
    this.#issue.value().title = title;
    this.#issue.value().issue = issue;
    this.#issue.value().coverPrice = coverPrice;
    this.#issue.value().url = url;

    if (this.#isNew) {
      this.#issueStore.add(this.#issue.value());
    } else {
      this.#issueStore.update(this.#issue.value());
    }
    this.#location.back();
  }

  protected saveNew() {
    const { publisher, title, issue, coverPrice, url } = this.issueEditForm.getRawValue();
    this.#issue.value().publisher = publisher;
    this.#issue.value().title = title;
    this.#issue.value().issue = issue;
    this.#issue.value().coverPrice = coverPrice;
    this.#issue.value().url = url;

    if (this.#isNew) {
      this.#issueStore.add(this.#issue.value());
    } else {
      this.#issueStore.update(this.#issue.value());
    }

    // create new issue object and set publisher, title and coverPrice values
    this.#issue.set({
      publisher: publisher,
      title: title,
      coverPrice: coverPrice,
      url: url,
      //id: null,
      issue: null,
    });
    this.issueEditForm.patchValue({
      publisher: this.#issue.value().publisher,
      title: this.#issue.value().title,
      coverPrice: this.#issue.value().coverPrice,
      issue: this.#issue.value().issue,
      url: this.#issue.value().url,
    });
    this.#isNew.set(true);
  }

  protected publisherId(index: number, publisher: Publisher) {
    return publisher.id;
  }

  protected titleId(index: number, title: Title) {
    return title.id;
  }
}

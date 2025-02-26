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
import { IssueDataService } from '../shared/services/issue/issue-data.service';
import { Publisher } from '../shared/models/publisher';
import { PublisherDataService } from '../shared/services/publisher/publisher-data.service';
import { Title } from '../shared/models/title';
import { TitleDataService } from '../shared/services/title/title-data.service';
import { IsssueEditCardComponent } from './isssue-edit-card.component';

@Component({
  selector: 'app-issue-edit',
  template: `<app-isssue-edit-card
    [(issueEditForm)]="issueEditForm"
    [filteredPublishers]="filteredPublishers()"
    [filteredTitles]="filteredTitles()"
    (cancel)="cancel()"
    (save)="save()"
    (saveNew)="saveNew()"
    (onAutocompleteKeyUpPublisher)="onAutocompleteKeyUpPublisher($event)"
    (onAutocompleteKeyUpTitle)="onAutocompleteKeyUpTitle($event)" />`,
  imports: [IsssueEditCardComponent],
})
export default class IssueEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #issueStore = inject(IssueDataService);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherDataService);
  readonly #titleStore = inject(TitleDataService);

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

  protected onAutocompleteKeyUpPublisher(searchText: string): void {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected onAutocompleteKeyUpTitle(searchText: string): void {
    this.titleFilter.set(searchText?.toLowerCase());
  }

  protected save() {
    const { publisher, title, issue, coverPrice, url } = this.issueEditForm.getRawValue();
    this.#issue.value().publisher = publisher;
    this.#issue.value().title = title;
    this.#issue.value().issue = issue;
    this.#issue.value().coverPrice = coverPrice;
    this.#issue.value().url = url;

    if (this.#isNew()) {
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

    if (this.#isNew()) {
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

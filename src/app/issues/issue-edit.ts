import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, resource, signal } from '@angular/core';
import { Location } from '@angular/common';
import { form } from '@angular/forms/signals';

import { Issue, ISSUE_EDIT_SCHEMA } from '../shared/models/issue-interface';
import { IssueData } from '../shared/services/issue/issue-data';
import { IsssueEditCard } from './isssue-edit-card';
import { Publisher } from '../shared/models/publisher-interface';
import { PublisherData } from '../shared/services/publisher/publisher-data';
import { Title } from '../shared/models/title-interface';
import { TitleData } from '../shared/services/title/title-data';

@Component({
  selector: 'app-issue-edit',
  imports: [IsssueEditCard],
  template: `<app-isssue-edit-card
    [form]="form"
    [filteredPublishers]="filteredPublishers()"
    [filteredTitles]="filteredTitles()"
    (cancel)="cancel()"
    (save)="save()"
    (saveNew)="saveNew()"
    (onAutocompleteKeyUpPublisher)="onAutocompleteKeyUpPublisher($event)"
    (onAutocompleteKeyUpTitle)="onAutocompleteKeyUpTitle($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IssueEdit implements OnInit {
  readonly #issueStore = inject(IssueData);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherData);
  readonly #titleStore = inject(TitleData);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);

  readonly #issue = resource<Issue, string>({
    params: this.id,
    loader: async ({ params: id }) => {
      if (id === 'new') return { publisher: '', title: '', issue: null, coverPrice: null, url: '' };
      const issue = await this.#issueStore.getById(+id);
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

  readonly form = form(this.#issue.value, ISSUE_EDIT_SCHEMA);

  async ngOnInit() {
    if (this.id() !== 'new' && this.id() != undefined) {
      this.#isNew.set(false);
    }
  }

  protected cancel() {
    this.#location.back();
  }

  protected onAutocompleteKeyUpPublisher(searchText: string): void {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected onAutocompleteKeyUpTitle(searchText: string): void {
    this.titleFilter.set(searchText?.toLowerCase());
  }

  protected save() {
    if (this.#isNew()) {
      this.#issueStore.add(this.#issue.value());
    } else {
      this.#issueStore.update(this.#issue.value());
    }
    this.#location.back();
  }

  protected saveNew() {
    if (this.#isNew()) {
      this.#issueStore.add(this.#issue.value());
    } else {
      this.#issueStore.update(this.#issue.value());
    }

    // create new issue object and set publisher, title and coverPrice values
    this.#issue.set({
      publisher: this.#issue.value().publisher,
      title: this.#issue.value().title,
      coverPrice: this.#issue.value().coverPrice,
      url: this.#issue.value().url,
      issue: null,
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

import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, resource, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Publisher } from '../../shared/models/publisher-interface';
import { PublisherData } from '../../shared/services/publisher/publisher-data';
import { Title } from '../../shared/models/title-interface';
import { TitleData } from '../../shared/services/title/title-data';
import { TitleEditCard } from './title-edit-card';
import { Router } from '@angular/router';
import { form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-title-edit',
  imports: [TitleEditCard],
  template: `
    <app-title-edit-card
      [form]="form"
      [filteredPublishers]="filteredPublishers()"
      (cancel)="cancel()"
      (save)="save()"
      (saveNew)="saveNew()"
      (onAutocompleteKeyUp)="onAutocompleteKeyUp($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TitleEdit {
  readonly #publisherStore = inject(PublisherData);
  readonly #titleStore = inject(TitleData);
  readonly #router = inject(Router);

  protected readonly id = input<string>();
  readonly #isNew = computed<boolean>(() => (this.id() !== 'new' && this.id() != undefined ? false : true));

  protected readonly publisherFilter = signal<string>('');
  readonly #publishers = this.#publisherStore.sortedPublishers;
  protected readonly filteredPublishers = computed(() => {
    return this.publisherFilter() == ''
      ? this.#publishers()
      : this.#publishers().filter((r) => r.name.toLocaleLowerCase().startsWith(this.publisherFilter()));
  });

  readonly #title = resource<Title, string>({
    params: this.id,
    loader: async ({ params: id }) => {
      if (id === 'new') return { publisher: '', title: '' };
      const title = await this.#titleStore.getById(+id);
      return title;
    },
  });

  readonly form = form(this.#title.value, (path) => {
    required(path.publisher, { message: 'Please select the publisher name' });
    required(path.title, { message: 'Please enter the title' });
  });

  protected cancel() {
    this.#router.navigateByUrl('/admin/titles');
  }

  protected onAutocompleteKeyUp(searchText: string) {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected save() {
    if (this.#isNew()) {
      this.#titleStore.add(this.#title.value());
    } else {
      this.#titleStore.update(this.#title.value());
    }
    this.#router.navigateByUrl('/admin/titles');
  }

  protected saveNew() {
    if (this.#isNew()) {
      this.#titleStore.add(this.#title.value());
    } else {
      this.#titleStore.update(this.#title.value());
    }

    // create set publisher
    this.form().reset();
    this.#title.update((prevTitle) => ({ ...prevTitle, id: null, title: '' }));
    this.#router.navigateByUrl('/admin/title/new');
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, input, resource, signal } from '@angular/core';
import { customError, form, required, submit, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { Publisher } from '../../shared/models/publisher-interface';
import { PublisherData } from '../../shared/services/publisher/publisher-data';
import { Title } from '../../shared/models/title-interface';
import { TitleData } from '../../shared/services/title/title-data';
import { TitleEditCard } from './title-edit-card';

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
    validate(path.publisher, (ctx) => {
      const value = ctx.value();
      if (value == '') {
        return null;
      }
      const selectedItem: Publisher = this.#publishers().find((p: Publisher) => p.name === value);
      if (selectedItem) {
        return null; /* valid option selected */
      }
      return customError({ kind: 'invalid-publisher', message: 'Please select publisher name from the list' });
    });
  });

  protected cancel() {
    this.#router.navigateByUrl('/admin/titles');
  }

  protected onAutocompleteKeyUp(searchText: string) {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected async save() {
    await submit(this.form, async (form) => {
      try {
        if (this.#isNew()) {
          await this.#titleStore.add(form().value());
        } else {
          await this.#titleStore.update(form().value());
        }
        this.#router.navigateByUrl('/admin/titles');
        return undefined;
      } catch (error) {
        return [{ kind: 'save', message: 'Error saving title. Please try again.' }];
      }
    });
  }

  protected async saveNew() {
    await submit(this.form, async (form) => {
      try {
        if (this.#isNew()) {
          await this.#titleStore.add(form().value());
        } else {
          await this.#titleStore.update(form().value());
        }
        this.form().reset();
        this.#titleStore.saveLastPublisher(this.#title.value().publisher);
        this.#router.navigateByUrl('/admin/title/new');
        return undefined;
      } catch (error) {
        return [{ kind: 'save', message: 'Error saving title. Please try again.' }];
      }
    });
  }
}

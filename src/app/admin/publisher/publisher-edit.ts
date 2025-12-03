import { ChangeDetectionStrategy, Component, OnInit, inject, input, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form } from '@angular/forms/signals';

import { Publisher, PUBLISHER_EDIT_SCHEMA } from '../../shared/models/publisher-interface';
import { PublisherData } from '../../shared/services/publisher/publisher-data';
import { PublisherEditCard } from './publisher-edit-card';

@Component({
  selector: 'app-publisher-edit',
  imports: [PublisherEditCard],
  template: ` <app-publisher-edit-card [form]="form" (cancel)="cancel()" (save)="save()" (saveNew)="saveNew()" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PublisherEdit implements OnInit {
  readonly #router = inject(Router);
  readonly #publisherStore = inject(PublisherData);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);

  readonly #publisher = resource<Publisher, string>({
    params: this.id,
    loader: async ({ params: id }) => {
      if (id === 'new') return { name: '' };
      const publisher = await this.#publisherStore.getById(+id);
      return publisher;
    },
  });

  readonly form = form(this.#publisher.value, PUBLISHER_EDIT_SCHEMA);

  ngOnInit() {
    if (this.id() !== 'new' || this.id() == undefined) {
      this.#isNew.set(false);
    }
  }

  protected save() {
    if (this.#isNew()) {
      this.#publisherStore.add(this.#publisher.value());
    } else {
      this.#publisherStore.update(this.#publisher.value());
    }
    this.#router.navigateByUrl('/admin/publishers');
  }

  protected cancel() {
    this.#router.navigateByUrl('/admin/publishers');
  }

  protected saveNew() {
    if (this.#isNew()) {
      this.#publisherStore.add(this.#publisher.value());
    } else {
      this.#publisherStore.update(this.#publisher.value());
    }
    this.#publisher.set({ id: null, name: '' });
    this.#isNew.set(true);
    this.form().reset();
    this.#router.navigateByUrl('/admin/publisher/new');
  }
}

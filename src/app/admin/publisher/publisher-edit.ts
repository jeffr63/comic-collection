import { ChangeDetectionStrategy, Component, OnInit, inject, input, resource, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Publisher } from '../../shared/models/publisher-interface';
import { PublisherData } from '../../shared/services/publisher/publisher-data';
import { PublisherEditCard } from './publisher-edit-card';

@Component({
  selector: 'app-publisher-edit',
  imports: [ReactiveFormsModule, PublisherEditCard],
  template: `
    <app-publisher-edit-card
      [(publisherEditForm)]="publisherEditForm"
      (cancel)="cancel()"
      (save)="save()"
      (saveNew)="saveNew()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PublisherEdit implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherData);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);
  readonly #publisher = resource<Publisher, string>({
    params: this.id,
    loader: async ({ params: id }) => {
      if (id === 'new') return { name: '' };
      const publisher = await this.#publisherStore.getById(+id);
      this.loadFormValues(publisher);
      return publisher;
    },
  });
  protected publisherEditForm!: FormGroup;

  ngOnInit() {
    this.publisherEditForm = this.#fb.group({ name: ['', Validators.required] });
    if (this.id() !== 'new' || this.id() == undefined) {
      this.#isNew.set(false);
    }
  }

  protected loadFormValues(publisher: Publisher) {
    this.publisherEditForm?.get('name')?.setValue(publisher.name);
  }

  protected save() {
    this.#publisher.value().name = this.publisherEditForm.controls['name'].value;
    if (this.#isNew()) {
      this.#publisherStore.add(this.#publisher.value());
    } else {
      this.#publisherStore.update(this.#publisher.value());
    }
    this.#location.back();
  }

  protected cancel() {
    this.#location.back();
  }

  protected saveNew() {
    this.#publisher.value().name = this.publisherEditForm.controls['name'].value;
    if (this.#isNew()) {
      this.#publisherStore.add(this.#publisher.value());
    } else {
      this.#publisherStore.update(this.#publisher.value());
    }

    // clear publisher object, clear form object, reset flag to new
    this.#publisher.set({ name: '' });
    this.publisherEditForm.patchValue({ name: '' });
    this.#isNew.set(true);
  }
}

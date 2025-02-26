import { Component, OnInit, computed, inject, input, resource, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Publisher } from '../../shared/models/publisher';
import { PublisherDataService } from '../../shared/services/publisher/publisher-data.service';
import { Title } from '../../shared/models/title';
import { TitleDataService } from '../../shared/services/title/title-data.service';
import { TitleEditCardComponent } from './title-edit-card.component';

@Component({
  selector: 'app-title-edit',
  imports: [TitleEditCardComponent],
  template: `
    <app-title-edit-card
      [(titleEditForm)]="titleEditForm"
      [filteredPublishers]="filteredPublishers()"
      (cancel)="cancel()"
      (save)="save()"
      (saveNew)="saveNew()"
      (onAutocompleteKeyUp)="onAutocompleteKeyUp($event)" />
  `,
})
export default class TitleEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #publisherStore = inject(PublisherDataService);
  readonly #titleStore = inject(TitleDataService);

  protected readonly id = input<string>();
  readonly #isNew = signal(true);
  protected readonly publisherFilter = signal<string>('');
  readonly #publishers = this.#publisherStore.sortedPublishers;
  protected readonly filteredPublishers = computed(() => {
    return this.publisherFilter() == ''
      ? this.#publishers()
      : this.#publishers().filter((r) => r.name.toLocaleLowerCase().startsWith(this.publisherFilter()));
  });
  readonly #title = resource<Title, string>({
    request: this.id,
    loader: async ({ request: id }) => {
      if (id === 'new') return { publisher: '', title: '' };
      const title = await this.#titleStore.getById(+id);
      this.loadFormValues(title);
      return title;
    },
  });
  protected titleEditForm!: FormGroup;

  async ngOnInit() {
    this.titleEditForm = this.#fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringValidator()]],
      title: ['', Validators.required],
    });
    if (this.id() !== 'new' && this.id() != undefined) {
      this.#isNew.set(false);
    }
  }

  private loadFormValues(title: Title) {
    this.titleEditForm.get('publisher')?.setValue(title.publisher);
    this.titleEditForm.get('title')?.setValue(title.title);
  }

  protected cancel() {
    this.#location.back();
  }

  protected onAutocompleteKeyUp(searchText: string) {
    this.publisherFilter.set(searchText?.toLowerCase());
  }

  protected save() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.#title.value().publisher = publisher;
    this.#title.value().title = title;

    if (this.#isNew()) {
      this.#titleStore.add(this.#title.value());
    } else {
      this.#titleStore.update(this.#title.value());
    }
    this.#location.back();
  }

  protected saveNew() {
    const { publisher, title } = this.titleEditForm.getRawValue();
    this.#title.value().publisher = publisher;
    this.#title.value().title = title;
    if (this.#isNew()) {
      this.#titleStore.add(this.#title.value());
    } else {
      this.#titleStore.update(this.#title.value());
    }

    this.titleEditForm.patchValue({
      publisher: publisher,
      title: title,
    });

    // create new title object and set publisher
    this.#title.set({ publisher: publisher, title: '' });
    this.titleEditForm.patchValue({ publisher: this.#title.value().publisher, title: '' });
    this.#isNew.set(true);
  }

  private autocompleteStringValidator(): ValidatorFn {
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
}

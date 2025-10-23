import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, resource, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Publisher } from '../../shared/models/publisher-interface';
import { PublisherData } from '../../shared/services/publisher/publisher-data';
import { Title } from '../../shared/models/title-interface';
import { TitleData } from '../../shared/services/title/title-data';
import { TitleEditCard } from './title-edit-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title-edit',
  imports: [TitleEditCard],
  template: `
    <app-title-edit-card
      [(titleEditForm)]="titleEditForm"
      [filteredPublishers]="filteredPublishers()"
      (cancel)="cancel()"
      (save)="save()"
      (saveNew)="saveNew()"
      (onAutocompleteKeyUp)="onAutocompleteKeyUp($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TitleEdit implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
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
      this.loadFormValues(title);
      return title;
    },
  });

  protected titleEditForm!: FormGroup;

  ngOnInit() {
    this.titleEditForm = this.#fb.group({
      publisher: ['', [Validators.required, this.autocompleteStringValidator()]],
      title: ['', Validators.required],
    });
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
    this.#router.navigateByUrl('/admin/titles');
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

    // create set publisher
    this.titleEditForm.patchValue({ publisher: this.#title.value().publisher, title: '' });
    this.#router.navigateByUrl('/admin/title/new');
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

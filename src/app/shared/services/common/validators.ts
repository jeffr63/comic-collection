import { customError, FieldPath, validate } from '@angular/forms/signals';

import { Publisher } from '../../models/publisher-interface';
import { Signal } from '@angular/core';

export function validatePublisher(path: FieldPath<string>, publishers: Signal<Publisher[]>) {
  validate(path, (ctx) => {
    const value = ctx.value();

    console.log(value, publishers());

    if (value == '') {
      return null;
    }

    let selectedItem!: Publisher | undefined;
    selectedItem = publishers().find((publisher: Publisher) => publisher.name === value);
    if (selectedItem) {
      return null; /* valid option selected */
    }
    return customError({ kind: 'publisher', value });
  });
}

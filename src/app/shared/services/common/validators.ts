import { customError, FieldPath, validate } from '@angular/forms/signals';

import { Publisher } from '../../models/publisher-interface';

export function validatePublisher(path: FieldPath<string>, publishers: Publisher[]) {
  validate(path, (ctx) => {
    let selectedItem!: Publisher | undefined;

    const value = ctx.value();
    selectedItem = publishers.find((publisher: Publisher) => publisher.name === value);
    if (selectedItem) {
      return null; /* valid option selected */
    }
    return customError({ kind: 'publisher', value });
  });
}

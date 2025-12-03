import { inject, resource } from '@angular/core';
import { customError, required, schema, validateAsync } from '@angular/forms/signals';

import { PublisherData } from '../services/publisher/publisher-data';

export interface Title {
  title: string;
  publisher: string;
  id?: number | null;
}

export const TITLE_EDIT_SCHEMA = schema<Title>((schemaPath) => {
  required(schemaPath.publisher, { message: 'Please select the publisher name' });
  required(schemaPath.title, { message: 'Please enter the title' });
  validateAsync(schemaPath.publisher, {
    params: ({ value }) => value(),
    factory: (params) => {
      const publisher = inject(PublisherData);
      return resource({
        params,
        loader: async ({ params }) => {
          return await publisher.checkPublisherExists(params);
        },
      });
    },
    onSuccess: (result) => {
      if (result) {
        return null;
      }
      return customError({ kind: 'invalid-publisher', message: 'Please select publisher name from the list' });
    },
    onError: () => {
      return customError({ kind: 'invalid-publisher', message: 'Please select publisher name from the list' });
    },
  });
});

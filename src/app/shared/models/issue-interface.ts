import { inject, resource } from '@angular/core';
import { customError, min, required, schema, validateAsync } from '@angular/forms/signals';

import { PublisherData } from '../services/publisher/publisher-data';
import { TitleData } from '../services/title/title-data';

export interface Issue {
  publisher: string;
  title: string;
  issue: number | null;
  coverPrice: number;
  url: string;
  id?: number | null;
}

export interface IssueChartData {
  name: string;
  value: number;
}

export const ISSUE_EDIT_SCHEMA = schema<Issue>((schemaPath) => {
  required(schemaPath.publisher, { message: 'Please select the publisher' });
  required(schemaPath.title, { message: 'Please select the title' });
  required(schemaPath.issue, { message: 'Please enter the issue number' });
  required(schemaPath.coverPrice, { message: 'Please enter the cover price' });
  min(schemaPath.coverPrice, 0, { message: 'Cover price must be a positive number' });
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
  validateAsync(schemaPath.title, {
    params: ({ value }) => value(),
    factory: (params) => {
      const publisher = inject(TitleData);
      return resource({
        params,
        loader: async ({ params }) => {
          return await publisher.checkTitleExists(params);
        },
      });
    },
    onSuccess: (result) => {
      if (result) {
        return null;
      }
      return customError({ kind: 'invalid-title', message: 'Please select title from the list' });
    },
    onError: () => {
      return customError({ kind: 'invalid-title', message: 'Please select title from the list' });
    },
  });
});

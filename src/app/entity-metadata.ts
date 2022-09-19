import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Publishers: {
    sortComparer: sortByName,
  },
  Titles: {
    sortComparer: sortByTitle,
  },
  Issues: {},
  Users: {
    sortComparer: sortByName,
  },
};

export function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

export function sortByTitle(
  a: { title: string },
  b: { title: string }
): number {
  return a.title.localeCompare(b.title);
}

const pluralNames = {
  Publishers: 'Publishers',
  Titles: 'Titles',
  Issues: 'Issues',
  Users: 'Users',
};

export const entityConfig = {
  entityMetadata,
  pluralNames,
};

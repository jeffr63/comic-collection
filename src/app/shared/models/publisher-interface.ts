import { required, schema } from '@angular/forms/signals';

export interface Publisher {
  name: string;
  id?: number;
}

export const PUBLISHER_EDIT_SCHEMA = schema<Publisher>((schemaPath) => {
  required(schemaPath.name, { message: 'Please enter publisher name' });
});

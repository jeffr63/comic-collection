import { email, required, schema } from '@angular/forms/signals';

export interface User {
  email: string;
  password: string;
  name: string;
  userrole: string;
  id?: number;
}

export const USER_EDIT_SCHEMA = schema<User>((schemaPath) => {
  required(schemaPath.name, { message: 'Please enter the user name' });
  required(schemaPath.email, { message: 'Please enter the user email' });
  email(schemaPath.email, { message: 'Please enter a valid email' });
  required(schemaPath.userrole, { message: 'Please select role' });
});

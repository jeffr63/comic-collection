import { ChangeDetectionStrategy, Component, inject, input, resource } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { email, form, required } from '@angular/forms/signals';

import { User } from '../../shared/models/user-interface';
import { UserData } from '../../shared/services/user/user-data';
import { UserEditCard } from './user-edit-card';

@Component({
  selector: 'app-user-edit',
  imports: [UserEditCard],
  template: `<app-user-edit-card [form]="form" (save)="save()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserEdit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #userStore = inject(UserData);

  protected readonly id = input<string>();
  readonly #user = resource<User, string>({
    params: this.id,
    loader: async ({ params: id }) => {
      if (id === 'new') return { name: '', email: '', password: '', userrole: '' };
      const user = await this.#userStore.getById(+id);
      return user;
    },
  });

  readonly form = form(this.#user.value, (path) => {
    required(path.name, { message: 'Please enter the user name' });
    required(path.email, { message: 'Please enter the user email' });
    email(path.email, { message: 'Please enter a valid email' });
    required(path.userrole, { message: 'Please select role' });
  });

  protected async save() {
    await this.#userStore.update(this.#user.value());
    this.#location.back();
  }
}

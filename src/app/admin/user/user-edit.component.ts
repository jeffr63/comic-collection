import { Component, OnInit, inject, input, resource } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { User } from '../../shared/models/user';
import { UserDataService } from '../../shared/services/user/user-data.service';
import { UserEditCardComponent } from './user-edit-card.component';

@Component({
  selector: 'app-user-edit',
  imports: [UserEditCardComponent],
  template: `<app-user-edit-card [(userEditForm)]="userEditForm" (save)="save()" />`,
})
export default class UserEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #userStore = inject(UserDataService);

  protected readonly id = input<string>();
  readonly #user = resource<User, string>({
    params: this.id,
    loader: async ({ params: id }) => {
      if (id === 'new') return { name: '', email: '', password: '', role: '' };
      const user = await this.#userStore.getById(+id);
      this.loadFormValues(user);
      return user;
    },
  });

  protected userEditForm!: FormGroup;

  ngOnInit(): void {
    this.userEditForm = this.#fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  private loadFormValues(user: User) {
    this.userEditForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  protected async save() {
    const patchData = this.userEditForm.getRawValue();
    patchData.id = this.#user.value()?.id;
    if (!patchData) return;
    await this.#userStore.update(patchData);
    this.#location.back();
  }
}

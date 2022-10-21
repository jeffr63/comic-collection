import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NgIf,
    ReactiveFormsModule,
  ],

  template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Login</h2>
      <mat-dialog-content>
        <form [formGroup]="loginForm">
          <mat-form-field appearance="outline" class="mt-5">
            <mat-label for="email">Email Address</mat-label>
            <mat-icon matSuffix>mail_outline</mat-icon>
            <input
              ngbAutofocus
              type="email"
              id="email"
              matInput
              formControlName="email"
              placeholder="Enter email address"
            />
            <mat-error
              *ngIf="
                loginForm.controls['email']?.errors?.['required'] &&
                loginForm.controls['email']?.touched
              "
            >
              Email is required
            </mat-error>
            <mat-error
              *ngIf="
                loginForm.controls['email']?.errors?.['email'] &&
                loginForm.controls['email']?.touched
              "
            >
              Must enter valid email
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="mt-5">
            <mat-label for="email">Password</mat-label>
            <mat-icon (click)="flag = !flag" matSuffix>{{ flag ? 'visibility' : 'visibility_off' }}</mat-icon>
            <input
              type="password"
              id="password"
              matInput
              formControlName="password"
              [type]="flag ? 'password' : 'text'"
            />
            <mat-error
              *ngIf="
                loginForm.controls['password']?.errors?.['required'] &&
                loginForm.controls['password']?.touched
              "
            >
              Password is required
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions [align]="'end'">
        <button mat-flat-button color="primary" (click)="login()">Login</button>
        <button mat-flat-button mat-dialog-close color="warn" (click)="cancel()" class="ml-8">Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }

      .mt-5 {
        margin-top: 5px;
      }

      .ml-8 {
        margin-left: 8px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: '',
  };
  loginForm!: FormGroup;
  flag = true;

  constructor(public dialogRef: MatDialogRef<LoginComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, , Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.user.email = this.loginForm.controls['email'].value;
      this.user.password = this.loginForm.controls['password'].value;
      this.dialogRef.close(this.user);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

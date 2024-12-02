import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
    template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Login</h2>
      <mat-dialog-content>
        <form [formGroup]="loginForm">
          <mat-form-field appearance="outline" class="mt-5">
            <mat-label for="email">Email Address</mat-label>
            <mat-icon matIconSuffix>mail_outline</mat-icon>
            <input
              ngbAutofocus
              type="email"
              id="email"
              matInput
              formControlName="email"
              placeholder="Enter email address" />
            @let femail = loginForm.controls.email;
            <!-- email required error -->
            @if (femail.errors?.['required'] && femail.touched) {
            <mat-error> Email is required </mat-error>
            }
            <!-- invalid email error -->
            @if (femail.errors?.['email'] && femail.touched) {
            <mat-error> Must enter valid email </mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="mt-5">
            <mat-label for="email">Password</mat-label>
            <mat-icon (click)="flag = !flag" matIconSuffix>{{ flag ? 'visibility' : 'visibility_off' }}</mat-icon>
            <input
              type="password"
              id="password"
              matInput
              formControlName="password"
              [type]="flag ? 'password' : 'text'" />
            @let fpassword = loginForm.controls.password;
            <!-- password required error -->
            @if (fpassword.errors?.['required'] && fpassword.touched) {
            <mat-error> Password is required </mat-error>
            }
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
    ]
})
export class LoginComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);

  user = {
    email: '',
    password: '',
  };
  loginForm!: FormGroup;
  flag = true;

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

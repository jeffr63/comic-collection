import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink, provideRouter } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { of } from 'rxjs';
import { expect, beforeEach, vi } from 'vitest';
import { describe, it } from 'jasmine-core';

import { Menu } from './menu';
import { AuthService } from '../shared/services/auth/auth-service';

describe('MenuComponent', () => {
  let fixture: ComponentFixture<Menu>;
  let component: Menu;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        Menu,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        RouterLink,
        NoopAnimationsModule,
      ],
      providers: [provideRouter([]), MatDialog, AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should open a login dialog when login method is called', async () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'login');

    component.login();
    vi.spyOn(component.dialogRef, 'afterClosed').mockReturnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(component.dialogRef).toBeDefined();
    expect(dialogs.length).toBe(1);
  });

  it('should load the login dialog with title of Login', async () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'login');

    component.login();
    vi.spyOn(component.dialogRef, 'afterClosed').mockReturnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(await dialogs[0].getTitleText()).toBe('Login');
  });

  it('should display two input fields with labels Email Address and Password', async () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'login');

    component.login();
    vi.spyOn(component.dialogRef, 'afterClosed').mockReturnValue(of({ email: 'test', password: '123' }));
    await loader.getAllHarnesses(MatDialogHarness);

    expect(document.getElementsByTagName('input').length).toBe(2);

    const labels = document.getElementsByTagName('label');

    const email = <HTMLLabelElement>labels[0];
    expect(email.textContent).toEqual('Email Address');

    const password = <HTMLLabelElement>document.getElementsByTagName('label')[1];
    expect(password.textContent).toEqual('Password');
  });
});

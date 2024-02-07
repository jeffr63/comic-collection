import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RouterLink, provideRouter } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { of } from 'rxjs';

import { MenuComponent } from './menu.component';
import { AuthService } from '../shared/services/auth.service';

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MenuComponent,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        RouterLink,
        NoopAnimationsModule,
      ],
      providers: [provideRouter([]), MatDialog, AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should open a login dialog when login method is called', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.callThrough();

    component.login();
    spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(component.dialogRef).toBeDefined();
    expect(dialogs.length).toBe(1);
  });

  it('should open login dialog when Login button is clicked', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(component, 'login').and.callThrough();

    authService.logout();
    fixture.detectChanges();
    await fixture.whenStable();

    const login = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
    login.click();

    expect(await login.getText()).toBe('Login');
    expect(component.login).toHaveBeenCalled();
  });

  it('should load the login dialog with title of Login', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.callThrough();

    component.login();
    spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(await dialogs[0].getTitleText()).toBe('Login');
  });

  it('should display two input fields with labels Email Address and Password', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.callThrough();

    component.login();
    spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(document.getElementsByTagName('input').length).toBe(2);

    const email = document.getElementsByTagName('label')[0] as HTMLHeadElement;
    expect(email.innerText).toEqual('Email Address');

    const password = document.getElementsByTagName('label')[1] as HTMLHeadElement;
    expect(password.innerText).toEqual('Password');
  });
});

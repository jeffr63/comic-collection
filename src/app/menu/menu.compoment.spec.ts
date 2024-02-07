import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RouterLink, provideRouter } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MenuComponent } from './menu.component';
import { AuthService } from '../shared/services/auth.service';
import { of } from 'rxjs';

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

  it('should load harness for dialog', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.callThrough();

    component.login();
    spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(component.dialogRef).toBeDefined();
    expect(dialogs.length).toBe(1);
  });

  it('should load the login dialog', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.callThrough();

    component.login();
    spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({ email: 'test', password: '123' }));
    const dialogs = await loader.getAllHarnesses(MatDialogHarness);

    expect(await dialogs[0].getTitleText()).toBe('Login');
  });

  // it('should default the user name and passwords to last login', async () => {
  //   const authService = TestBed.inject(AuthService);
  //   spyOn(authService, 'login').and.callThrough();

  //   component.email = 'test';
  //   component.password = '123';
  //   component.login();
  //   spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({ email: 'test', password: '123' }));
  //   const dialogs = await loader.getAllHarnesses(MatDialogHarness);

  //   expect(await dialogs[0].getId()).toBe('test');
  // });
});

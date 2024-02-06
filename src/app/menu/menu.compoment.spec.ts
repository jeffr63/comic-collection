import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { Router, RouterLink, provideRouter } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { DebugElement, signal } from '@angular/core';
import { of } from 'rxjs';

class AuthServiceMock {
  isLoggedIn = signal(false);
  isLoggedInAsAdmin = signal(false);
  login(email: string, password: string) {}
  logout() {}
}

const mockData = { email: 'test', password: '123' };

export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(mockData),
    };
  }
}

fdescribe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;
  let authService: AuthService;
  let router: Router;
  let dialog: MatDialog;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuComponent, MatDialogModule, MatIconModule, MatToolbarModule, MatButtonModule, RouterLink],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });

  // it('should open login dialog and call authService login when open method is called', waitForAsync(() => {
  //   const dialogSpy = spyOn(dialog, 'open').and.callThrough();
  //   const loginSpy = spyOn(authService, 'login').and.callThrough();

  //   component.open();
  //   fixture.detectChanges();

  //   expect(dialogSpy).toHaveBeenCalled();
  //   expect(loginSpy).toHaveBeenCalledWith('test', '123');
  // }));
});

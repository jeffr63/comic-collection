import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { Router, RouterLink, provideRouter } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { signal } from '@angular/core';

class MockAuthService {
  isLoggedIn = signal(false);
  isLoggedInAsAdmin = signal(false);
  login() {}
  logout() {}
}

class MockMatDialog {
  open() {}
  afterClose() {}
  close() {}
}

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;
  let authService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuComponent, MatDialogModule, MatIconModule, MatToolbarModule, MatButtonModule, NgIf, RouterLink],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should open login dialog when login is clicked', () => {
    const loginbtn = fixture.nativeElement.querySelector('#login');
    loginbtn.click();
  })
});

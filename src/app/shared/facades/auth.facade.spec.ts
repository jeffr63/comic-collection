import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { AuthFacade } from './auth.facade';
import { AuthService } from '../services/auth.service';
import { fakeAuthResponse, fakeAuthTokenEncoded, fakeAuthTokenEncodedExpired } from '../../../testing/testing.data';

describe('AuthFacade', () => {
  let facade: AuthFacade;

  const authServiceStub = {
    login: jest.fn((email: string, password: string) => {
      return Promise.resolve(fakeAuthResponse);
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    });
    facade = TestBed.inject(AuthFacade);
  });

  it('creates a facade service', () => {
    expect(facade).toBeTruthy();
  });

  //login
  describe('login', () => {
    it('should call auth service login passing email and password', () => {
      facade.login('email@test.com', '1234');
      expect(authServiceStub.login).toBeCalledWith('email@test.com', '1234');
    });

    it('should call parseJWT token', async () => {
      const parseJWTspy = jest.spyOn(facade, 'parseJwt');
      await facade.login('email@test.com', '1234');
      expect(parseJWTspy).toBeCalledWith(fakeAuthResponse.accessToken);
    });

    it('shoud set local tct_auth local storage', async () => {
      await facade.login('email@test.com', '1234');
      const tct_auth = JSON.parse(localStorage.getItem('tct_auth'));
      expect(tct_auth.id).toBe(1);
    });

    it('should set the isLoggedIn signal value', async () => {
      await facade.login('email@test.com', '1234');
      expect(facade.isLoggedIn()).toBe(true);
    });

    it('should set the isLoggedInAsAdmin signal value', async () => {
      await facade.login('email@test.com', '1234');
      expect(facade.isLoggedInAsAdmin()).toBe(true);
    });
  });

  //logout
  describe('logout', () => {
    it('should remove the local store value', async () => {
      await facade.login('email@test.com', '1234');
      facade.logout();
      const tct_auth = JSON.parse(localStorage.getItem('tct_auth'));
      expect(tct_auth).toBe(null);
    });

    it('should set isLoggedIn signal to false', async () => {
      await facade.login('email@test.com', '1234');
      facade.logout();
      expect(facade.isLoggedIn()).toBe(false);
    });

    it('should set isLoggedInAsAdmin signal to false', async () => {
      await facade.login('email@test.com', '1234');
      facade.logout();
      expect(facade.isLoggedInAsAdmin()).toBe(false);
    });
  });

  //check login
  describe('checklogin', () => {
    it('should call set isLoggedIn signal to true if not expired', async () => {
      const auth = {
        token: fakeAuthTokenEncoded,
        role: 'admin',
        id: 1,
        expires: 2000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await facade.checkLogin();
      expect(facade.isLoggedIn()).toBe(true);
    });

    it('should call set isLoggedInAdmin signal to true if role is admin', async () => {
      const auth = {
        token: fakeAuthTokenEncoded,
        role: 'admin',
        id: 1,
        expires: 2000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await facade.checkLogin();
      expect(facade.isLoggedInAsAdmin()).toBe(true);
    });

    it('should call set isLoggedInAdmin signal to false if role is not admin', async () => {
      const auth = {
        token: fakeAuthTokenEncoded,
        role: 'user',
        id: 2,
        expires: 2000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await facade.checkLogin();
      expect(facade.isLoggedInAsAdmin()).toBe(false);
    });

    it('should call logout if local storeage token is expired', async () => {
      const logoutSpy = jest.spyOn(facade, 'logout');
      const auth = {
        token: fakeAuthTokenEncodedExpired,
        role: 'admin',
        id: 1,
        expires: 1000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await facade.checkLogin();
      expect(logoutSpy).toBeCalled();
    });
  });

  //parseJwt
  describe('parseJwt', () => {
    it('should return decoded jwt token', () => {
      const result = {
        email: 'admin@comics.com',
        iat: 2000000000,
        exp: 2000000000,
        sub: '1',
      };
      const token = facade.parseJwt(fakeAuthTokenEncoded);
      expect(token).toEqual(result);
    });
  });
});

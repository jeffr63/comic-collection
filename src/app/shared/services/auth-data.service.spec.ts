import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { AuthDataService } from './auth-data.service';
import { fakeAuthResponse, fakeAuthTokenEncoded, fakeAuthTokenEncodedExpired } from '../../../testing/testing.data';

describe('Authservice', () => {
  let service: AuthDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(AuthDataService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  //login
  describe('login', () => {
    it('should call auth service login passing email and password', () => {
      const userLoginSpy = jest.spyOn(service, 'userLogin').mockReturnValue(Promise.resolve(fakeAuthResponse));
      service.login('email@test.com', '1234');
      expect(userLoginSpy).toBeCalledWith('email@test.com', '1234');
    });

    it('should call parseJWT token', async () => {
      const parseJWTspy = jest.spyOn(service, 'parseJwt');
      const userLoginSpy = jest.spyOn(service, 'userLogin').mockReturnValue(Promise.resolve(fakeAuthResponse));
      await service.login('email@test.com', '1234');
      expect(parseJWTspy).toBeCalledWith(fakeAuthResponse.accessToken);
    });

    it('shoud set local tct_auth local storage', async () => {
      const userLoginSpy = jest.spyOn(service, 'userLogin').mockReturnValue(Promise.resolve(fakeAuthResponse));
      await service.login('email@test.com', '1234');
      const tct_auth = JSON.parse(localStorage.getItem('tct_auth'));
      expect(tct_auth.id).toBe(1);
    });

    it('should set the isLoggedIn signal value', async () => {
      const userLoginSpy = jest.spyOn(service, 'userLogin').mockReturnValue(Promise.resolve(fakeAuthResponse));
      await service.login('email@test.com', '1234');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should set the isLoggedInAsAdmin signal value', async () => {
      const userLoginSpy = jest.spyOn(service, 'userLogin').mockReturnValue(Promise.resolve(fakeAuthResponse));
      await service.login('email@test.com', '1234');
      expect(service.isLoggedInAsAdmin()).toBe(true);
    });

    it('should not set login if invalid response from service', () => {
      const userLoginSpy = jest
        .spyOn(service, 'userLogin')
        .mockReturnValue(Promise.resolve({ accessToken: null, user: { email: '', name: '', role: '', id: 0 } }));
      service.logout();
      service.login('', '');
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  //logout
  describe('logout', () => {
    it('should remove the local store value', async () => {
      const userLoginSpy = jest
        .spyOn(service, 'userLogin')
        .mockReturnValue(Promise.resolve({ accessToken: null, user: { email: '', name: '', role: '', id: 0 } }));
      await service.login('email@test.com', '1234');
      service.logout();
      const tct_auth = JSON.parse(localStorage.getItem('tct_auth'));
      expect(tct_auth).toBe(null);
    });

    it('should set isLoggedIn signal to false', async () => {
      const userLoginSpy = jest
        .spyOn(service, 'userLogin')
        .mockReturnValue(Promise.resolve({ accessToken: null, user: { email: '', name: '', role: '', id: 0 } }));
      await service.login('email@test.com', '1234');
      service.logout();
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should set isLoggedInAsAdmin signal to false', async () => {
      const userLoginSpy = jest
        .spyOn(service, 'userLogin')
        .mockReturnValue(Promise.resolve({ accessToken: null, user: { email: '', name: '', role: '', id: 0 } }));
      await service.login('email@test.com', '1234');
      service.logout();
      expect(service.isLoggedInAsAdmin()).toBe(false);
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
      await service.checkLogin();
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should call set isLoggedInAdmin signal to true if role is admin', async () => {
      const auth = {
        token: fakeAuthTokenEncoded,
        role: 'admin',
        id: 1,
        expires: 2000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await service.checkLogin();
      expect(service.isLoggedInAsAdmin()).toBe(true);
    });

    it('should call set isLoggedInAdmin signal to false if role is not admin', async () => {
      const auth = {
        token: fakeAuthTokenEncoded,
        role: 'user',
        id: 2,
        expires: 2000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await service.checkLogin();
      expect(service.isLoggedInAsAdmin()).toBe(false);
    });

    it('should call logout if local storeage token is expired', async () => {
      const logoutSpy = jest.spyOn(service, 'logout');
      const auth = {
        token: fakeAuthTokenEncodedExpired,
        role: 'admin',
        id: 1,
        expires: 1000000000,
      };
      localStorage.setItem('tct_auth', JSON.stringify(auth));
      await service.checkLogin();
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
      const token = service.parseJwt(fakeAuthTokenEncoded);
      expect(token).toEqual(result);
    });
  });
});

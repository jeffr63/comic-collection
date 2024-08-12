import { TestBed } from '@angular/core/testing';

import { describe, expect } from '@jest/globals';
import fetch from 'jest-fetch-mock';

import { AuthService } from './auth.service';
import { fakeAuthResponse } from '../../../testing/testing.data';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(AuthService);
    fetch.resetMocks();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call fetch once', async () => {
      fetch.mockResponseOnce(JSON.stringify(fakeAuthResponse));
      const result = await service.login('email@test.com', '1234');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return data if successful', async () => {
      fetch.mockResponseOnce(JSON.stringify(fakeAuthResponse));
      const result = await service.login('email@test.com', '1234');
      expect(result).toEqual(fakeAuthResponse);
    });
  });
});

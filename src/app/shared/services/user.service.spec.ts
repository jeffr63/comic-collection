import { TestBed } from '@angular/core/testing';

import fetchMock from 'jest-fetch-mock';

import { fakeUser, fakeUserData } from '../../../testing/testing.data';
import { UserService } from './user.service';

describe('userService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    fetchMock.resetMocks();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeUserData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
    });

    it('should set the users signal with fetched data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeUserData));
      await service.getAll();
      expect(service.users()).toEqual(fakeUserData);
    });
  });

  //add
  describe('add', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeUser), { status: 200 }],
        [JSON.stringify(fakeUserData), { status: 200 }]
      );
      await service.add(fakeUser);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakeUser), { status: 200 }],
        [JSON.stringify(fakeUserData), { status: 200 }]
      );
      await service.add(fakeUser);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeUser), { status: 200 }],
        [JSON.stringify(fakeUserData), { status: 200 }]
      );
      const returnedUser = await service.add(fakeUser);
      expect(returnedUser).toEqual(fakeUser);
    });
  });

  //delete
  describe('delete', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(fakeUserData), { status: 200 }]);
      await service.delete(3);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(fakeUserData), { status: 200 }]);
      await service.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeUser));
      await service.getById(1);
      expect(fetch).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeUser));
      const result = await service.getById(1);
      expect(result).toEqual(fakeUser);
    });
  });

  //search
  describe('search', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeUserData));
      await service.search('abc');
      expect(fetch).toHaveBeenCalled();
    });

    it('should return array of search result users', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeUserData));
      const result = await service.search('abc');
      expect(result).toEqual(fakeUserData);
    });
  });

  //update
  describe('update', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeUser), { status: 200 }],
        [JSON.stringify(fakeUserData), { status: 200 }]
      );
      await service.update(fakeUser);
      expect(fetch).toHaveBeenCalled();
    });

    it('should getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakeUser), { status: 200 }],
        [JSON.stringify(fakeUserData), { status: 200 }]
      );
      await service.update(fakeUser);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeUser), { status: 200 }],
        [JSON.stringify(fakeUserData), { status: 200 }]
      );
      const result = await service.update(fakeUser);
      expect(result).toEqual(fakeUser);
    });
  });
});

import { UserService } from './user.service';
import { newUser, userData } from '../../../testing/testing.data';
import { TestBed } from '@angular/core/testing';
import fetchMock from 'jest-fetch-mock';
import { User } from '../models/user';

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
    it('should set the users signal when getAll method is called', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(userData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
      expect(service.users().length).toBeGreaterThan(0);
    });

    it('should set the users signal to data from the fetch call', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(userData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
      expect(service.users()).toEqual(userData);
    });
  });

  //add
  describe('add', () => {
    it('should call fetch, getAll, and return user data', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses([JSON.stringify(newUser), { status: 200 }], [JSON.stringify(userData), { status: 200 }]);
      const returnedUser = await service.add(newUser);
      expect(fetch).toHaveBeenCalled();
      expect(getAllSpy).toHaveBeenCalled();
      expect(service.users().length).toEqual(2);
      expect(returnedUser).toEqual(newUser);
    });
  });

  //delete
  describe('delete', () => {
    it('should call fetch and getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(userData), { status: 200 }]);
      fetchMock.mockResponses;
      await service.delete(3);
      expect(fetch).toHaveBeenCalled();
      expect(getAllSpy).toHaveBeenCalled();
      expect(service.users().length).toEqual(2);
    });
  });

  //getById
  describe('getById', () => {
    it('should call fetch and return user data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(newUser));
      const result = await service.getById(1);
      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(newUser);
    });
  });

  //search
  describe('search', () => {
    it('should call fetch and return array of search result users', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(userData));
      const result = await service.search('abc');
      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(userData);
    });
  });

  //update
  describe('update', () => {
    it('should call fetch, getAll, and return user data', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses([JSON.stringify(newUser), { status: 200 }], [JSON.stringify(userData), { status: 200 }]);
      const result = await service.update(newUser);
      expect(fetch).toHaveBeenCalled();
      expect(getAllSpy).toHaveBeenCalled();
      expect(service.users().length).toEqual(2);
      expect(result).toEqual(newUser);
    });
  });
});

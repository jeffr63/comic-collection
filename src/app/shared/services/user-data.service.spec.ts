import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakeUser, fakeUserData } from '../../../testing/testing.data';
import { User } from '../models/user';
import { UserDataService } from './user-data.service';
import { DataService } from './data.service';

describe('UserDataService', () => {
  let service: UserDataService;
  const url = 'http://localhost:3000/users';

  const dataServiceStub = {
    add: jest.fn((data: User, url: string) => {
      return fakeUser;
    }),
    delete: jest.fn((id: number, url: string) => {}),
    getAll: jest.fn((url: string) => {
      return fakeUserData;
    }),
    getById: jest.fn((id: number, url: string) => {
      return fakeUser;
    }),
    search: jest.fn((term: string, url: string) => {
      if (term === '' || url === '') {
        return [];
      }
      return fakeUserData;
    }),
    update: jest.fn((id: number, data: User, url: string) => {
      return fakeUser;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    });
    service = TestBed.inject(UserDataService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  //add
  describe('add', () => {
    it('should call user service add with passed user', async () => {
      await service.add(fakeUser);
      expect(dataServiceStub.add).toBeCalledWith(fakeUser, url);
    });

    it('should return user data', async () => {
      const returnedUser = await service.add(fakeUser);
      expect(returnedUser).toEqual(fakeUser);
    });
  });

  //delete
  describe('delete', () => {
    it('should call user service delete with passed id', async () => {
      await service.delete(3);
      expect(dataServiceStub.delete).toBeCalledWith(3, url);
    });
  });

  //getById
  describe('getById', () => {
    it('should call user service getById with passed id', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toBeCalledWith(1, url);
    });

    it('should return user data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakeUser);
    });
  });

  //search
  describe('search', () => {
    it('should call user service search with passed search term', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalledWith('abc', url);
    });

    it('should return array of search result users', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakeUserData);
    });

    it('shoud return empty array when search term is blank', async () => {
      const result = await service.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should call user service update with passed user', async () => {
      await service.update(fakeUser);
      expect(dataServiceStub.update).toBeCalledWith(3, fakeUser, url);
    });

    it('should return user data', async () => {
      const result = await service.update(fakeUser);
      expect(result).toEqual(fakeUser);
    });
  });
});

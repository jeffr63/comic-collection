import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { DataService } from '../common/data-service';
import { fakeUser, fakeUserData } from '../../../../testing/testing-data';
import { User } from '../../models/user-interface';
import { UserData } from './user-data';

describe('UserDataService', () => {
  let service: UserData;

  const url = 'http://localhost:3000/users';

  const dataServiceStub = {
    add: jest.fn((data: User, url: string) => {
      return fakeUser;
    }),
    addx: jest.fn((data: User, url: string) => {
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
    service = TestBed.inject(UserData);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  // initiazation
  describe('initialization', () => {
    it('should call the data service getAll method with passed url', () => {
      TestBed.flushEffects();
      expect(dataServiceStub.getAll).toBeCalledWith(url);
    });

    // it('should initialize users signal with values', async () => {
    //   const service1 = TestBed.inject(UserDataService);
    //   const dataService1 = TestBed.inject(DataService);
    //   const getAllSpy = jest.spyOn(dataService1, 'getAll').mockReturnValue(Promise.resolve(fakeUserData));
    //   TestBed.flushEffects();
    //   expect(service1.users()).toBe(fakeUserData);
    // });
  });

  //add
  describe('add', () => {
    it('should call data service add method with passed user and url', async () => {
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

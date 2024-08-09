import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakeUser, fakeUserData } from '../../../testing/testing.data';
import { User } from '../models/user';
import { UserFacade } from './user.facade';
import { UserService } from '../services/user.service';

describe('userService', () => {
  let facade: UserFacade;

  const userServiceStub = {
    add: jest.fn((user: User) => {
      return fakeUser;
    }),
    delete: jest.fn((id: number) => {}),
    getAll: jest.fn(() => {
      return fakeUserData;
    }),
    getById: jest.fn((id: number) => {
      return fakeUser;
    }),
    search: jest.fn((term: string) => {
      return fakeUserData;
    }),
    update: jest.fn((user: User) => {
      return fakeUser;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: userServiceStub }],
    });
    facade = TestBed.inject(UserFacade);
  });

  it('creates a service', () => {
    expect(facade).toBeTruthy();
  });

  //getall
  describe('getAll', () => {
    it('should call user service getAll', async () => {
      await facade.getAll();
      expect(userServiceStub.getAll).toHaveBeenCalled();
    });

    it('should set the users signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.users()).toEqual(fakeUserData);
    });
  });

  // //add
  describe('add', () => {
    it('should call user service add with passed user', async () => {
      await facade.add(fakeUser);
      expect(userServiceStub.add).toBeCalledWith(fakeUser);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.add(fakeUser);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      const returnedUser = await facade.add(fakeUser);
      expect(returnedUser).toEqual(fakeUser);
    });
  });

  //delete
  describe('delete', () => {
    it('should call user service delete with passed id', async () => {
      await facade.delete(3);
      expect(userServiceStub.delete).toBeCalledWith(3);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call user service getById with passed id', async () => {
      await facade.getById(1);
      expect(userServiceStub.getById).toBeCalledWith(1);
    });

    it('should return user data', async () => {
      const result = await facade.getById(1);
      expect(result).toEqual(fakeUser);
    });
  });

  //search
  describe('search', () => {
    it('should call user service search with passed search term', async () => {
      await facade.search('abc');
      expect(userServiceStub.search).toBeCalledWith('abc');
    });

    it('should return array of search result users', async () => {
      const result = await facade.search('abc');
      expect(result).toEqual(fakeUserData);
    });

    it('shoud return empty array when search term is blank', async () => {
      const result = await facade.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should call user service update with passed user', async () => {
      await facade.update(fakeUser);
      expect(userServiceStub.update).toBeCalledWith(fakeUser);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakeUser);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      const result = await facade.update(fakeUser);
      expect(result).toEqual(fakeUser);
    });
  });
});

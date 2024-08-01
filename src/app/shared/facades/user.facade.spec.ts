import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakeUser, fakeUserData } from '../../../testing/testing.data';
import { UserService } from '../services/user.service';
import { UserFacade } from './user.facade';

const userServiceStub = {
  add: jest.fn(() => {
    return fakeUser;
  }),
  delete: jest.fn(),
  getAll: jest.fn(() => {
    return fakeUserData;
  }),
  getById: jest.fn(() => {
    return fakeUser;
  }),
  search: jest.fn(() => {
    return fakeUserData;
  }),
  update: jest.fn(() => {
    return fakeUser;
  }),
};

describe('userService', () => {
  let facade: UserFacade;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: userServiceStub }],
    });
    facade = TestBed.inject(UserFacade);
    service = TestBed.inject(UserService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  //getall
  describe('getAll', () => {
    it('should call user service getAll', async () => {
      await facade.getAll();
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should set the users signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.users()).toEqual(fakeUserData);
    });
  });

  // //add
  describe('add', () => {
    it('should call user service add', async () => {
      await facade.add(fakeUser);
      expect(service.add).toBeCalledWith(fakeUser);
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
    it('should call fetch', async () => {
      await facade.delete(3);
      expect(service.delete).toBeCalledWith(3);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call fetch', async () => {
      await facade.getById(1);
      expect(service.getById).toBeCalledWith(1);
    });

    it('should return user data', async () => {
      const result = await facade.getById(1);
      expect(result).toEqual(fakeUser);
    });
  });

  //search
  describe('search', () => {
    it('should call fetch', async () => {
      await facade.search('abc');
      expect(service.search).toBeCalledWith('abc');
    });

    it('should return array of search result users', async () => {
      const result = await facade.search('abc');
      expect(result).toEqual(fakeUserData);
    });
  });

  //update
  describe('update', () => {
    it('should call fetch', async () => {
      await facade.update(fakeUser);
      expect(service.update).toBeCalledWith(fakeUser);
    });

    it('should getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakeUser);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      const result = await service.update(fakeUser);
      expect(result).toEqual(fakeUser);
    });
  });
});

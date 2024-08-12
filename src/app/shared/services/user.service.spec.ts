import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { DataService } from './data.service';
import { fakeUser, fakeUserData } from '../../../testing/testing.data';
import { User } from '../models/user';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
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
    service = TestBed.inject(UserService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should call data service add', async () => {
      await service.add(fakeUser);
      expect(dataServiceStub.add).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.add(fakeUser);
      expect(dataServiceStub.add).toBeCalledWith(fakeUser, url);
    });

    it('should return data', async () => {
      const result = await service.add(fakeUser);
      expect(result).toEqual(fakeUser);
    });
  });

  describe('delete', () => {
    it('should call data service delete', async () => {
      await service.delete(1);
      expect(dataServiceStub.delete).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.delete(1);
      expect(dataServiceStub.delete).toBeCalledWith(1, url);
    });
  });

  describe('getAll', () => {
    it('should call data service getAll', async () => {
      await service.getAll();
      expect(dataServiceStub.getAll).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.getAll();
      expect(dataServiceStub.getAll).toBeCalledWith(url);
    });

    it('should return data', async () => {
      const result = await service.getAll();
      expect(result).toEqual(fakeUserData);
    });
  });

  describe('getById', () => {
    it('should call data service getById', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toBeCalledWith(1, url);
    });

    it('should return data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakeUser);
    });
  });

  describe('search', () => {
    it('should call data service search', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalledWith('abc', url);
    });

    it('should return data', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakeUserData);
    });
  });

  describe('update', () => {
    it('should call data server update', async () => {
      await service.update(fakeUser);
      expect(dataServiceStub.update).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.update(fakeUser);
      expect(dataServiceStub.update).toBeCalledWith(3, fakeUser, url);
    });

    it('should return data', async () => {
      const result = await service.update(fakeUser);
      expect(result).toEqual(fakeUser);
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { DataService } from './data.service';
import { fakeTitle, fakeTitleData } from '../../../testing/testing.data';
import { TitleService } from './title.service';
import { Title } from '../models/title';

describe('TitleService', () => {
  let service: TitleService;
  const url = 'http://localhost:3000/titles';

  const dataServiceStub = {
    add: jest.fn((data: Title, url: string) => {
      return fakeTitle;
    }),
    delete: jest.fn((id: number, url: string) => {}),
    getAll: jest.fn((url: string) => {
      return fakeTitleData;
    }),
    getById: jest.fn((id: number, url: string) => {
      return fakeTitle;
    }),
    search: jest.fn((term: string, url: string) => {
      return fakeTitleData;
    }),
    update: jest.fn((id: number, data: Title, url: string) => {
      return fakeTitle;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    });
    service = TestBed.inject(TitleService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should call data service add', async () => {
      await service.add(fakeTitle);
      expect(dataServiceStub.add).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.add(fakeTitle);
      expect(dataServiceStub.add).toBeCalledWith(fakeTitle, url);
    });

    it('should return data', async () => {
      const result = await service.add(fakeTitle);
      expect(result).toEqual(fakeTitle);
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
      expect(result).toEqual(fakeTitleData);
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
      expect(result).toEqual(fakeTitle);
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
      expect(result).toEqual(fakeTitleData);
    });
  });

  describe('update', () => {
    it('should call data server update', async () => {
      await service.update(fakeTitle);
      expect(dataServiceStub.update).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.update(fakeTitle);
      expect(dataServiceStub.update).toBeCalledWith(3, fakeTitle, url);
    });

    it('should return data', async () => {
      const result = await service.update(fakeTitle);
      expect(result).toEqual(fakeTitle);
    });
  });
});

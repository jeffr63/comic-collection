import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { DataService } from './data.service';
import { fakePublisher, fakePublisherData } from '../../../testing/testing.data';
import { Publisher } from '../models/publisher';
import { PublisherService } from './publisher.service';

describe('PublisherService', () => {
  let service: PublisherService;
  const url = 'http://localhost:3000/publishers';

  const dataServiceStub = {
    add: jest.fn((data: Publisher, url: string) => {
      return fakePublisher;
    }),
    delete: jest.fn((id: number, url: string) => {}),
    getAll: jest.fn((url: string) => {
      return fakePublisherData;
    }),
    getById: jest.fn((id: number, url: string) => {
      return fakePublisher;
    }),
    search: jest.fn((term: string, url: string) => {
      return fakePublisherData;
    }),
    update: jest.fn((id: number, data: Publisher, url: string) => {
      return fakePublisher;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    });
    service = TestBed.inject(PublisherService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should call data service add', async () => {
      await service.add(fakePublisher);
      expect(dataServiceStub.add).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.add(fakePublisher);
      expect(dataServiceStub.add).toBeCalledWith(fakePublisher, url);
    });

    it('should return data', async () => {
      const result = await service.add(fakePublisher);
      expect(result).toEqual(fakePublisher);
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
      expect(result).toEqual(fakePublisherData);
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
      expect(result).toEqual(fakePublisher);
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
      expect(result).toEqual(fakePublisherData);
    });
  });

  describe('update', () => {
    it('should call data server update', async () => {
      await service.update(fakePublisher);
      expect(dataServiceStub.update).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.update(fakePublisher);
      expect(dataServiceStub.update).toBeCalledWith(3, fakePublisher, url);
    });

    it('should return data', async () => {
      const result = await service.update(fakePublisher);
      expect(result).toEqual(fakePublisher);
    });
  });
});

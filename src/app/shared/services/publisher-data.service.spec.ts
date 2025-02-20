import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakePublisher, fakePublisherData } from '../../../testing/testing.data';
import { PublisherDataService } from './publisher-data.service';
import { Publisher } from '../models/publisher';
import { DataService } from './data.service';

describe('Publisherservice', () => {
  let service: PublisherDataService;

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
      if (term === '' || url === '') {
        return [];
      }
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
    service = TestBed.inject(PublisherDataService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  //add
  describe('add', () => {
    it('should call publisher service add with passed publisher', async () => {
      await service.add(fakePublisher);
      expect(dataServiceStub.add).toBeCalledWith(fakePublisher, url);
    });

    it('should return publisher data', async () => {
      const returnedUser = await service.add(fakePublisher);
      expect(returnedUser).toEqual(fakePublisher);
    });
  });

  //delete
  describe('delete', () => {
    it('should call publisher service delete with passed id', async () => {
      await service.delete(3);
      expect(dataServiceStub.delete).toBeCalledWith(3, url);
    });
  });

  //getById
  describe('getById', () => {
    it('should call publisher service getById with passed id', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakePublisher);
    });
  });

  //search
  describe('search', () => {
    it('should call publisher service search with passed search term', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalledWith('abc', url);
    });

    it('should return array of search result publishers', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakePublisherData);
    });

    it('shoud return empty array when search term is blank', async () => {
      const result = await service.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should call publisher service update with passed id', async () => {
      await service.update(fakePublisher);
      expect(dataServiceStub.update).toBeCalledWith(3, fakePublisher, url);
    });

    it('should return publisher data', async () => {
      const result = await service.update(fakePublisher);
      expect(result).toEqual(fakePublisher);
    });
  });
});

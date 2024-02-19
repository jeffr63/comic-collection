import { TestBed } from '@angular/core/testing';

import fetchMock from 'jest-fetch-mock';

import { fakePublisher, fakePublisherData } from '../../../testing/testing.data';
import { PublisherService } from './publisher.service';

describe('PublisherService', () => {
  let service: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublisherService],
    });
    service = TestBed.inject(PublisherService);
    fetchMock.resetMocks();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should set call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakePublisherData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
    });

    it('should set the publishers signal with fetched data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakePublisherData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
      expect(service.publishers()).toEqual(fakePublisherData);
    });
  });

  //add
  describe('add', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakePublisher), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      await service.add(fakePublisher);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakePublisher), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      await service.add(fakePublisher);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakePublisher), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      const returnedUser = await service.add(fakePublisher);
      expect(returnedUser).toEqual(fakePublisher);
    });
  });

  //delete
  describe('delete', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(3), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      await service.delete(3);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(3), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      await service.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakePublisher));
      await service.getById(1);
      expect(fetch).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakePublisher));
      const result = await service.getById(1);
      expect(result).toEqual(fakePublisher);
    });
  });

  //search
  describe('search', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakePublisherData));
      await service.search('abc');
      expect(fetch).toHaveBeenCalled();
    });

    it('should return array of search result publishers', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakePublisherData));
      const result = await service.search('abc');
      expect(result).toEqual(fakePublisherData);
    });
  });

  //update
  describe('update', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakePublisher), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      await service.update(fakePublisher);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakePublisher), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      await service.update(fakePublisher);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakePublisher), { status: 200 }],
        [JSON.stringify(fakePublisherData), { status: 200 }]
      );
      const result = await service.update(fakePublisher);
      expect(result).toEqual(fakePublisher);
    });
  });
});

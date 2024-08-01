import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakePublisher, fakePublisherData } from '../../../testing/testing.data';
import { PublisherService } from '../services/publisher.service';
import { PublisherFacade } from './publisher.facade';

const publisherServiceStub = {
  add: jest.fn(() => {
    return fakePublisher;
  }),
  delete: jest.fn(),
  getAll: jest.fn(() => {
    return fakePublisherData;
  }),
  getById: jest.fn(() => {
    return fakePublisher;
  }),
  search: jest.fn(() => {
    return fakePublisherData;
  }),
  update: jest.fn(() => {
    return fakePublisher;
  }),
};

describe('PublisherFacade', () => {
  let facade: PublisherFacade;
  let service: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PublisherService, useValue: publisherServiceStub }],
    });
    facade = TestBed.inject(PublisherFacade);
    service = TestBed.inject(PublisherService);
  });

  it('creates a facade service', () => {
    expect(facade).toBeTruthy();
  });

  //getall
  describe('getAll', () => {
    it('should set call publisher service getAll', async () => {
      await facade.getAll();
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should set the publishers signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.publishers()).toEqual(fakePublisherData);
    });
  });

  //add
  describe('add', () => {
    it('should call publisher service add', async () => {
      await facade.add(fakePublisher);
      expect(service.add).toBeCalledWith(fakePublisher);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.add(fakePublisher);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      const returnedUser = await facade.add(fakePublisher);
      expect(returnedUser).toEqual(fakePublisher);
    });
  });

  //delete
  describe('delete', () => {
    it('should call publisher service delete', async () => {
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
    it('should call publisher service getById', async () => {
      await facade.getById(1);
      expect(service.getById).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakePublisher);
    });
  });

  //search
  describe('search', () => {
    it('should call publisher service search', async () => {
      await facade.search('abc');
      expect(service.search).toBeCalledWith('abc');
    });

    it('should return array of search result publishers', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakePublisherData);
    });
  });

  //update
  describe('update', () => {
    it('should call publisher service update', async () => {
      await facade.update(fakePublisher);
      expect(service.update).toBeCalledWith(fakePublisher);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakePublisher);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      const result = await service.update(fakePublisher);
      expect(result).toEqual(fakePublisher);
    });
  });
});

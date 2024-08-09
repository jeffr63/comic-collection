import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakePublisher, fakePublisherData } from '../../../testing/testing.data';
import { PublisherService } from '../services/publisher.service';
import { PublisherFacade } from './publisher.facade';
import { Publisher } from '../models/publisher';

describe('PublisherFacade', () => {
  let facade: PublisherFacade;

  const publisherServiceStub = {
    add: jest.fn(() => {
      return fakePublisher;
    }),
    delete: jest.fn(),
    getAll: jest.fn(() => {
      return fakePublisherData;
    }),
    getById: jest.fn((id: number) => {
      return fakePublisher;
    }),
    search: jest.fn((term: string) => {
      return fakePublisherData;
    }),
    update: jest.fn((publisher: Publisher) => {
      return fakePublisher;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PublisherService, useValue: publisherServiceStub }],
    });
    facade = TestBed.inject(PublisherFacade);
  });

  it('creates a facade service', () => {
    expect(facade).toBeTruthy();
  });

  //getall
  describe('getAll', () => {
    it('should set call publisher service getAll', async () => {
      await facade.getAll();
      expect(publisherServiceStub.getAll).toHaveBeenCalled();
    });

    it('should set the publishers signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.publishers()).toEqual(fakePublisherData);
    });
  });

  //add
  describe('add', () => {
    it('should call publisher service add with passed publisher', async () => {
      await facade.add(fakePublisher);
      expect(publisherServiceStub.add).toBeCalledWith(fakePublisher);
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
    it('should call publisher service delete with passed id', async () => {
      await facade.delete(3);
      expect(publisherServiceStub.delete).toBeCalledWith(3);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call publisher service getById with passed id', async () => {
      await facade.getById(1);
      expect(publisherServiceStub.getById).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      const result = await facade.getById(1);
      expect(result).toEqual(fakePublisher);
    });
  });

  //search
  describe('search', () => {
    it('should call publisher service search with passed search term', async () => {
      await facade.search('abc');
      expect(publisherServiceStub.search).toBeCalledWith('abc');
    });

    it('should return array of search result publishers', async () => {
      const result = await facade.search('abc');
      expect(result).toEqual(fakePublisherData);
    });

    it('shoud return empty array when search term is blank', async () => {
      const result = await facade.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should call publisher service update with passed id', async () => {
      await facade.update(fakePublisher);
      expect(publisherServiceStub.update).toBeCalledWith(fakePublisher);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakePublisher);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return publisher data', async () => {
      const result = await facade.update(fakePublisher);
      expect(result).toEqual(fakePublisher);
    });
  });
});

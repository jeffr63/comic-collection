import { TestBed } from '@angular/core/testing';

import fetchMock from 'jest-fetch-mock';

import { fakeTitle, fakeTitleData } from '../../../testing/testing.data';
import { TitleService } from './title.service';

describe('userService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleService],
    });
    service = TestBed.inject(TitleService);
    fetchMock.resetMocks();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeTitleData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
    });

    it('should set the users signal with fetched data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeTitleData));
      await service.getAll();
      expect(service.titles()).toEqual(fakeTitleData);
    });
  });

  //add
  describe('add', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeTitle), { status: 200 }],
        [JSON.stringify(fakeTitleData), { status: 200 }]
      );
      await service.add(fakeTitle);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakeTitle), { status: 200 }],
        [JSON.stringify(fakeTitleData), { status: 200 }]
      );
      await service.add(fakeTitle);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeTitle), { status: 200 }],
        [JSON.stringify(fakeTitleData), { status: 200 }]
      );
      const returnedUser = await service.add(fakeTitle);
      expect(returnedUser).toEqual(fakeTitle);
    });
  });

  //delete
  describe('delete', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(fakeTitleData), { status: 200 }]);
      await service.delete(3);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(fakeTitleData), { status: 200 }]);
      await service.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeTitle));
      await service.getById(1);
      expect(fetch).toHaveBeenCalled();
    });

    it('should return user data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeTitle));
      const result = await service.getById(1);
      expect(result).toEqual(fakeTitle);
    });
  });

  //search
  describe('search', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeTitleData));
      await service.search('abc');
      expect(fetch).toHaveBeenCalled();
    });

    it('should return array of search result titles', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeTitleData));
      const result = await service.search('abc');
      expect(result).toEqual(fakeTitleData);
    });
  });

  //update
  describe('update', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeTitle), { status: 200 }],
        [JSON.stringify(fakeTitleData), { status: 200 }]
      );
      await service.update(fakeTitle);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakeTitle), { status: 200 }],
        [JSON.stringify(fakeTitleData), { status: 200 }]
      );
      await service.update(fakeTitle);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeTitle), { status: 200 }],
        [JSON.stringify(fakeTitleData), { status: 200 }]
      );
      const result = await service.update(fakeTitle);
      expect(result).toEqual(fakeTitle);
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { expect, beforeEach, vi, describe, it } from 'vitest';

import { DataService } from '../common/data-service';
import { fakeTitle, fakeTitleData } from '../../../../testing/testing-data';
import { TitleData } from './title-data';
import { Title } from '@angular/platform-browser';

describe('TitleDataService', () => {
  let service: TitleData;
  const url = 'http://localhost:3000/titles';

  const dataServiceStub = {
    add: vi.fn((data: Title, url: string) => {
      return fakeTitle;
    }),
    delete: vi.fn((id: number, url: string) => {}),
    getAll: vi.fn((url: string) => {
      return fakeTitleData;
    }),
    getById: vi.fn((id: number, url: string) => {
      return fakeTitle;
    }),
    search: vi.fn((term: string, url: string) => {
      if (term === '' || url === '') {
        return [];
      }
      return fakeTitleData;
    }),
    update: vi.fn((id: number, data: Title, url: string) => {
      return fakeTitle;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    });
    service = TestBed.inject(TitleData);
  });

  it('creates a service service', () => {
    expect(service).toBeTruthy();
  });

  //add
  describe('add', () => {
    it('should call title service add with passed title', async () => {
      await service.add(fakeTitle);
      expect(dataServiceStub.add).toBeCalledWith(fakeTitle, url);
    });

    it('should return title data', async () => {
      const returnedUser = await service.add(fakeTitle);
      expect(returnedUser).toEqual(fakeTitle);
    });
  });

  //delete
  describe('delete', () => {
    it('should call title service delete with passed id', async () => {
      await service.delete(3);
      expect(dataServiceStub.delete).toBeCalledWith(3, url);
    });
  });

  //getById
  describe('getById', () => {
    it('should call title service getById with passed id', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakeTitle);
    });
  });

  //search
  describe('search', () => {
    it('should call title service search with passed search term', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalledWith('abc', url);
    });

    it('should return array of search result titles', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakeTitleData);
    });

    it('shoud return empty array when search term is blank', async () => {
      const result = await service.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should call data service update with passed title', async () => {
      await service.update(fakeTitle);
      expect(dataServiceStub.update).toBeCalledWith(3, fakeTitle, url);
    });

    it('should return title data', async () => {
      const result = await service.update(fakeTitle);
      expect(result).toEqual(fakeTitle);
    });
  });
});

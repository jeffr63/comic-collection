import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakeTitle, fakeTitleData } from '../../../testing/testing.data';
import { TitleService } from '../services/title.service';
import { TitleFacade } from './title.facade';
import { Title } from '@angular/platform-browser';

describe('TitleFacade', () => {
  let facade: TitleFacade;

  const titleServiceStub = {
    add: jest.fn(() => {
      return fakeTitle;
    }),
    delete: jest.fn((id) => {}),
    getAll: jest.fn(() => {
      return fakeTitleData;
    }),
    getById: jest.fn((id: number) => {
      return fakeTitle;
    }),
    search: jest.fn((term: string) => {
      return fakeTitleData;
    }),
    update: jest.fn((title: Title) => {
      return fakeTitle;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TitleService, useValue: titleServiceStub }],
    });
    facade = TestBed.inject(TitleFacade);
  });

  it('creates a facade service', () => {
    expect(facade).toBeTruthy();
  });

  //getall
  describe('getAll', () => {
    it('should set call title service getAll', async () => {
      await facade.getAll();
      expect(titleServiceStub.getAll).toHaveBeenCalled();
    });

    it('should set the titles signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.titles()).toEqual(fakeTitleData);
    });
  });

  //add
  describe('add', () => {
    it('should call title service add with passed title', async () => {
      await facade.add(fakeTitle);
      expect(titleServiceStub.add).toBeCalledWith(fakeTitle);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.add(fakeTitle);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      const returnedUser = await facade.add(fakeTitle);
      expect(returnedUser).toEqual(fakeTitle);
    });
  });

  //delete
  describe('delete', () => {
    it('should call title service delete with passed id', async () => {
      await facade.delete(3);
      expect(titleServiceStub.delete).toBeCalledWith(3);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call title service getById with passed id', async () => {
      await facade.getById(1);
      expect(titleServiceStub.getById).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      const result = await titleServiceStub.getById(1);
      expect(result).toEqual(fakeTitle);
    });
  });

  //search
  describe('search', () => {
    it('should call title service search with passed search term', async () => {
      await facade.search('abc');
      expect(titleServiceStub.search).toBeCalledWith('abc');
    });

    it('should return array of search result titles', async () => {
      const result = await titleServiceStub.search('abc');
      expect(result).toEqual(fakeTitleData);
    });
  });

  //update
  describe('update', () => {
    it('should call title service update with passed title', async () => {
      await facade.update(fakeTitle);
      expect(titleServiceStub.update).toBeCalledWith(fakeTitle);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakeTitle);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      const result = await facade.update(fakeTitle);
      expect(result).toEqual(fakeTitle);
    });
  });
});

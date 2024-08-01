import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakeTitle, fakeTitleData } from '../../../testing/testing.data';
import { TitleService } from '../services/title.service';
import { TitleFacade } from './title.facade';

const titleServiceStub = {
  add: jest.fn(() => {
    return fakeTitle;
  }),
  delete: jest.fn(),
  getAll: jest.fn(() => {
    return fakeTitleData;
  }),
  getById: jest.fn(() => {
    return fakeTitle;
  }),
  search: jest.fn(() => {
    return fakeTitleData;
  }),
  update: jest.fn(() => {
    return fakeTitle;
  }),
};

describe('TitleFacade', () => {
  let facade: TitleFacade;
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TitleService, useValue: titleServiceStub }],
    });
    facade = TestBed.inject(TitleFacade);
    service = TestBed.inject(TitleService);
  });

  it('creates a facade service', () => {
    expect(facade).toBeTruthy();
  });

  //getall
  describe('getAll', () => {
    it('should set call title service getAll', async () => {
      await facade.getAll();
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should set the titles signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.titles()).toEqual(fakeTitleData);
    });
  });

  //add
  describe('add', () => {
    it('should call title service add', async () => {
      await facade.add(fakeTitle);
      expect(service.add).toBeCalledWith(fakeTitle);
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
    it('should call title service delete', async () => {
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
    it('should call title service getById', async () => {
      await facade.getById(1);
      expect(service.getById).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakeTitle);
    });
  });

  //search
  describe('search', () => {
    it('should call title service search', async () => {
      await facade.search('abc');
      expect(service.search).toBeCalledWith('abc');
    });

    it('should return array of search result titles', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakeTitleData);
    });
  });

  //update
  describe('update', () => {
    it('should call title service update', async () => {
      await facade.update(fakeTitle);
      expect(service.update).toBeCalledWith(fakeTitle);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakeTitle);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return title data', async () => {
      const result = await service.update(fakeTitle);
      expect(result).toEqual(fakeTitle);
    });
  });
});

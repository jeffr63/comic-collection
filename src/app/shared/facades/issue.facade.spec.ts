import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { fakeIssue, fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../../testing/testing.data';
import { IssueService } from '../services/issue.service';
import { IssueFacade } from './issue.facade';

const issueServiceStub = {
  add: jest.fn(() => {
    return fakeIssue;
  }),
  delete: jest.fn(),
  getAll: jest.fn(() => {
    return fakeIssueData;
  }),
  getById: jest.fn(() => {
    return fakeIssue;
  }),
  search: jest.fn(() => {
    return fakeIssueData;
  }),
  update: jest.fn(() => {
    return fakeIssue;
  }),
};

describe('Issuefacade', () => {
  let facade: IssueFacade;
  let service: IssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IssueService, useValue: issueServiceStub }],
    });
    facade = TestBed.inject(IssueFacade);
    service = TestBed.inject(IssueService);
  });

  it('creates a facade service', () => {
    expect(facade).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call issue service getAll', async () => {
      await facade.getAll();
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should set the issues signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.issues()).toEqual(fakeIssueData);
    });

    it('should compute the publishers signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.publishers()).toEqual(fakeIssuePublishersData);
    });

    it('should compute the titles signal with fetched data', async () => {
      await facade.getAll();
      expect(facade.titles()).toEqual(fakeIssueTitlesData);
    });
  });

  //add
  describe('add', () => {
    it('should call issue service add', async () => {
      await facade.add(fakeIssue);
      expect(service.add).toBeCalledWith(fakeIssue);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.add(fakeIssue);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return issue data', async () => {
      const returnedUser = await facade.add(fakeIssue);
      expect(returnedUser).toEqual(fakeIssue);
    });
  });

  //delete
  describe('delete', () => {
    it('should call fetch', async () => {
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
    it('should call fetch', async () => {
      await facade.getById(1);
      expect(service.getById).toBeCalledWith(1);
    });

    it('should return issue data', async () => {
      const result = await facade.getById(1);
      expect(result).toEqual(fakeIssue);
    });
  });

  //search
  describe('search', () => {
    it('should call issue service search', async () => {
      await facade.search('abc');
      expect(service.search).toBeCalledWith('abc');
    });

    it('should return array of search result issues', async () => {
      const result = await facade.search('abc');
      expect(result).toEqual(fakeIssueData);
    });
  });

  //update
  describe('update', () => {
    it('should call issue service update', async () => {
      await facade.update(fakeIssue);
      expect(service.update).toBeCalledWith(fakeIssue);
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(facade, 'getAll');
      await facade.update(fakeIssue);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return issue data', async () => {
      const result = await facade.update(fakeIssue);
      expect(result).toEqual(fakeIssue);
    });
  });

  describe('helper methods', () => {
    it('getByPublisherValue method should return transformed issue data', () => {
      const result = facade.getByPublisherValue(fakeIssueData);
      expect(result).toEqual(fakeIssuePublishersData);
    });

    it('getByTitleValue method should return transformed issue data', () => {
      const result = facade.getByTitleValue(fakeIssueData);
      expect(result).toEqual(fakeIssueTitlesData);
    });
  });
});

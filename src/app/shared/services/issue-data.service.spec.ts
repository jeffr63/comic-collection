import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { DataService } from './data.service';
import { fakeIssue, fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../../testing/testing.data';
import { IssueDataService } from './issue-data.service';
import { Issue } from '../models/issue';

describe('IssueDataService', () => {
  let service: IssueDataService;

  const url = 'http://localhost:3000/issues';

  const dataServiceStub = {
    add: jest.fn((data: Issue, url: string) => {
      return fakeIssue;
    }),
    delete: jest.fn((id: number, url: string) => {}),
    getAll: jest.fn((url: string) => {
      return fakeIssueData;
    }),
    getById: jest.fn((id: number, url: string) => {
      return fakeIssue;
    }),
    search: jest.fn((term: string, url: string) => {
      if (term === '' || url === '') {
        return [];
      }
      return fakeIssueData;
    }),
    update: jest.fn((id: number, data: Issue, url: string) => {
      return fakeIssue;
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    });
    service = TestBed.inject(IssueDataService);
  });

  it('creates a service service', () => {
    expect(service).toBeTruthy();
  });

  //add
  describe('add', () => {
    it('should call issue service add with passed issue', async () => {
      await service.add(fakeIssue);
      expect(dataServiceStub.add).toBeCalledWith(fakeIssue, url);
    });

    it('should return issue data', async () => {
      const returnedUser = await service.add(fakeIssue);
      expect(returnedUser).toEqual(fakeIssue);
    });
  });

  //delete
  describe('delete', () => {
    it('should call issue service delete with passed id', async () => {
      await service.delete(3);
      expect(dataServiceStub.delete).toBeCalledWith(3, url);
    });
  });

  //getById
  describe('getById', () => {
    it('should call issue service with passed id', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toBeCalledWith(1, url);
    });

    it('should return issue data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakeIssue);
    });
  });

  //search
  describe('search', () => {
    it('should call issue service search with passed search term', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalledWith('abc', url);
    });

    it('should return array of search result issues', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakeIssueData);
    });

    it('shoud return empty array when search term is blank', async () => {
      const result = await service.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should call issue service update with passed issue', async () => {
      await service.update(fakeIssue);
      expect(dataServiceStub.update).toBeCalledWith(4, fakeIssue, url);
    });

    it('should return issue data', async () => {
      const result = await service.update(fakeIssue);
      expect(result).toEqual(fakeIssue);
    });
  });

  // helper methods
  describe('helper methods', () => {
    it('getByPublisherValue method should return transformed issue data', () => {
      const result = service.getByPublisherValue(fakeIssueData);
      expect(result).toEqual(fakeIssuePublishersData);
    });

    it('getByTitleValue method should return transformed issue data', () => {
      const result = service.getByTitleValue(fakeIssueData);
      expect(result).toEqual(fakeIssueTitlesData);
    });
  });
});

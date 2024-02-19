import { TestBed } from '@angular/core/testing';

import fetchMock from 'jest-fetch-mock';

import { fakeIssue, fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../../testing/testing.data';
import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueService],
    });
    service = TestBed.inject(IssueService);
    fetchMock.resetMocks();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssueData));
      await service.getAll();
      expect(fetch).toHaveBeenCalled();
    });

    it('should set the issues signal with fetched data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssueData));
      await service.getAll();
      expect(service.issues()).toEqual(fakeIssueData);
    });

    it('should compute the publishers signal with fetched data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssueData));
      await service.getAll();
      expect(service.publishers()).toEqual(fakeIssuePublishersData);
    });

    it('should compute the titles signal with fetched data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssueData));
      await service.getAll();
      expect(service.titles()).toEqual(fakeIssueTitlesData);
    });
  });

  //add
  describe('add', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeIssue), { status: 200 }],
        [JSON.stringify(fakeIssueData), { status: 200 }]
      );
      await service.add(fakeIssue);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakeIssue), { status: 200 }],
        [JSON.stringify(fakeIssueData), { status: 200 }]
      );
      await service.add(fakeIssue);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return issue data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeIssue), { status: 200 }],
        [JSON.stringify(fakeIssueData), { status: 200 }]
      );
      const returnedUser = await service.add(fakeIssue);
      expect(returnedUser).toEqual(fakeIssue);
    });
  });

  //delete
  describe('delete', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(fakeIssueData), { status: 200 }]);
      await service.delete(3);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses([JSON.stringify(3), { status: 200 }], [JSON.stringify(fakeIssueData), { status: 200 }]);
      await service.delete(3);
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  //getById
  describe('getById', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssue));
      await service.getById(1);
      expect(fetch).toHaveBeenCalled();
    });

    it('should return issue data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.getById(1);
      expect(result).toEqual(fakeIssue);
    });
  });

  //search
  describe('search', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssueData));
      await service.search('abc');
      expect(fetch).toHaveBeenCalled();
    });

    it('should return array of search result issues', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(fakeIssueData));
      const result = await service.search('abc');
      expect(result).toEqual(fakeIssueData);
    });
  });

  //update
  describe('update', () => {
    it('should call fetch', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeIssue), { status: 200 }],
        [JSON.stringify(fakeIssueData), { status: 200 }]
      );
      await service.update(fakeIssue);
      expect(fetch).toHaveBeenCalled();
    });

    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(service, 'getAll');
      fetchMock.mockResponses(
        [JSON.stringify(fakeIssue), { status: 200 }],
        [JSON.stringify(fakeIssueData), { status: 200 }]
      );
      await service.update(fakeIssue);
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should return issue data', async () => {
      fetchMock.mockResponses(
        [JSON.stringify(fakeIssue), { status: 200 }],
        [JSON.stringify(fakeIssueData), { status: 200 }]
      );
      const result = await service.update(fakeIssue);
      expect(result).toEqual(fakeIssue);
    });
  });

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

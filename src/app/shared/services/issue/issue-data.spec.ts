import { TestBed } from '@angular/core/testing';

import { expect, beforeEach, describe, it } from 'vitest';

import {
  fakeIssue,
  fakeIssueData,
  fakeIssueUpdate,
  fakeIssuePublishersData,
  fakeIssueTitlesData,
} from '../../../../testing/testing-data';
import { IssueData } from '../issue/issue-data';
import { DataServiceFake, provideDataServiceFake } from '../common/data-service-fake';

describe('IssueDataService', () => {
  let service: IssueData;
  let dataService;

  const url = 'http://localhost:3000/issues';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideDataServiceFake()],
    });
    service = TestBed.inject(IssueData);
    dataService = TestBed.inject(DataServiceFake);
  });

  it('creates a service service', () => {
    expect(service).toBeTruthy();
  });

  //add
  describe('add', () => {
    it('should return issue data', async () => {
      dataService.configure([]);
      const returnedUser = await service.add(fakeIssue);
      expect(returnedUser).toEqual(fakeIssue);
    });
  });

  //delete
  describe('delete', () => {
    it('should call issue service delete with passed id', async () => {
      dataService.configure(fakeIssueData);
      await service.delete(3);
      const issues = await dataService.getAll();
      expect(issues.length).toBe(2);
    });
  });

  //getById
  describe('getById', () => {
    it('should return issue data', async () => {
      dataService.configure(fakeIssueData);
      const result = await service.getById(1);
      expect(result).toEqual(fakeIssueData[0]);
    });
  });

  //search
  describe('search', () => {
    it('should return array of search result issues', async () => {
      dataService.configure(fakeIssueData);
      const result = await service.search('abc');
      expect(result).toEqual(fakeIssueData);
    });

    it('shoud return empty array when search term is blank', async () => {
      dataService.configure(fakeIssueData);
      const result = await service.search('');
      expect(result).toEqual([]);
    });
  });

  //update
  describe('update', () => {
    it('should return issue data', async () => {
      dataService.configure(fakeIssueData);
      const result = await service.update(fakeIssueUpdate);
      expect(result).toEqual(fakeIssueUpdate);
    });
  });

  // helper methods
  describe('helper methods', () => {
    it('getByPublisherValue method should return transformed issue data', () => {
      dataService.configure(fakeIssueData);
      const result = service.getByPublisherValue(fakeIssueData);
      expect(result).toEqual(fakeIssuePublishersData);
    });

    it('getByTitleValue method should return transformed issue data', () => {
      dataService.configure(fakeIssueData);
      const result = service.getByTitleValue(fakeIssueData);
      expect(result).toEqual(fakeIssueTitlesData);
    });
  });
});

import { expect, beforeEach, vi, describe, it } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { TestBed } from '@angular/core/testing';

import { DataService } from './data-service';
import { fakeIssue, fakeIssueData } from '../../../../testing/testing-data';
import { Issue } from '../../models/issue-interface';

describe('DataService', () => {
  let service: DataService;
  let url = 'http://localhost:3000/issues';
  const fetchMocker = createFetchMock(vi);
  fetchMocker.enableMocks();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(DataService);
    fetchMocker.mockClear();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should call fetch once', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.add<Issue>(fakeIssue, url);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return data if successful', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.add<Issue>(fakeIssue, url);
      expect(result).toEqual(fakeIssue);
    });

    it('should return empty object if issue not found', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify({}));
      const result = await service.add<Issue>(fakeIssue, url);
      expect(result).toEqual({});
    });

    it('should return empty object api error', async () => {
      fetchMocker.mockResponseOnce(() => Promise.reject('API is down'));
      const result = await service.add<Issue>(fakeIssue, url);
      expect(result).toEqual({});
    });
  });

  describe('delete', () => {
    it('should call fetch once', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.delete(1, url);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('should call fetch once', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssueData));
      const result = await service.getAll<Issue[]>(url);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return data if successful', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssueData));
      const result = await service.getAll<Issue[]>(url);
      expect(result).toEqual(fakeIssueData);
    });

    it('should return empty array if issue not found', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify([]));
      const result = await service.getAll<Issue[]>(url);
      expect(result).toEqual([]);
    });

    it('should return empty array api error', async () => {
      fetchMocker.mockResponseOnce(() => Promise.reject('API is down'));
      const result = await service.getAll<Issue[]>(url);
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should call fetch once', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.getById<Issue>(1, url);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return data if successful', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.getById<Issue>(1, url);
      expect(result).toEqual(fakeIssue);
    });

    it('should return empty object if issue not found', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify({}));
      const result = await service.getById<Issue>(1, url);
      expect(result).toEqual({});
    });

    it('should return empty object api error', async () => {
      fetchMocker.mockResponseOnce(() => Promise.reject('API is down'));
      const result = await service.getById<Issue>(1, url);
      expect(result).toEqual({});
    });
  });

  describe('search', () => {
    it('should call fetch once', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssueData));
      const result = await service.search<Issue[]>('abc', url);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return data if successful', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssueData));
      const result = await service.search<Issue[]>('abc', url);
      expect(result).toEqual(fakeIssueData);
    });

    it('should return empty array if issue not found', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify([]));
      const result = await service.search<Issue[]>('xyz', url);
      expect(result).toEqual([]);
    });

    it('should return empty array api error', async () => {
      fetchMocker.mockResponseOnce(() => Promise.reject('API is down'));
      const result = await service.search<Issue[]>('abc', url);
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should call fetch once', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.update<Issue>(1, fakeIssue, url);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return data if successful', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify(fakeIssue));
      const result = await service.update<Issue>(1, fakeIssue, url);
      expect(result).toEqual(fakeIssue);
    });

    it('should return empty object if issue not found', async () => {
      fetchMocker.mockResponseOnce(JSON.stringify({}));
      const result = await service.update<Issue>(1, fakeIssue, url);
      expect(result).toEqual({});
    });

    it('should return empty object api error', async () => {
      fetchMocker.mockResponseOnce(() => Promise.reject('API is down'));
      const result = await service.update<Issue>(1, fakeIssue, url);
      expect(result).toEqual({});
    });
  });
});

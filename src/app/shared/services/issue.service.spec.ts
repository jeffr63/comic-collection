import { TestBed } from '@angular/core/testing';

import { describe, expect, jest } from '@jest/globals';

import { IssueService } from './issue.service';
import { fakeIssue, fakeIssueData } from '../../../testing/testing.data';
import { Issue } from '../models/issue';
import { DataService } from './data.service';

describe('IssueService', () => {
  let service: IssueService;
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
    service = TestBed.inject(IssueService);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should call data service add', async () => {
      await service.add(fakeIssue);
      expect(dataServiceStub.add).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.add(fakeIssue);
      expect(dataServiceStub.add).toBeCalledWith(fakeIssue, url);
    });

    it('should return data', async () => {
      const result = await service.add(fakeIssue);
      expect(result).toEqual(fakeIssue);
    });
  });

  describe('delete', () => {
    it('should call data service delete', async () => {
      await service.delete(1);
      expect(dataServiceStub.delete).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.delete(1);
      expect(dataServiceStub.delete).toBeCalledWith(1, url);
    });
  });

  describe('getAll', () => {
    it('should call data service getAll', async () => {
      await service.getAll();
      expect(dataServiceStub.getAll).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.getAll();
      expect(dataServiceStub.getAll).toBeCalledWith(url);
    });

    it('should return data', async () => {
      const result = await service.getAll();
      expect(result).toEqual(fakeIssueData);
    });
  });

  describe('getById', () => {
    it('should call data service getById', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.getById(1);
      expect(dataServiceStub.getById).toBeCalledWith(1, url);
    });

    it('should return data', async () => {
      const result = await service.getById(1);
      expect(result).toEqual(fakeIssue);
    });
  });

  describe('search', () => {
    it('should call data service search', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.search('abc');
      expect(dataServiceStub.search).toBeCalledWith('abc', url);
    });

    it('should return data', async () => {
      const result = await service.search('abc');
      expect(result).toEqual(fakeIssueData);
    });
  });

  describe('update', () => {
    it('should call data server update', async () => {
      await service.update(fakeIssue);
      expect(dataServiceStub.update).toBeCalled();
    });

    it('should call data service add with correct paramaters', async () => {
      await service.update(fakeIssue);
      expect(dataServiceStub.update).toBeCalledWith(4, fakeIssue, url);
    });

    it('should return data', async () => {
      const result = await service.update(fakeIssue);
      expect(result).toEqual(fakeIssue);
    });
  });
});

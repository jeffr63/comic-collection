import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

import { describe, expect, jest } from '@jest/globals';

import { AuthFacade } from '../shared/facades/auth.facade';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData, fakeTitle } from '../../testing/testing.data';
import { IssueFacade } from '../shared/facades/issue.facade';
import { ModalDataService } from '../shared/modals/modal-data.service';
import TitleIssueListComponent from './title-issue-list.component';
import { TitleFacade } from '../shared/facades/title.facade';

const authServiceStub = {
  isLoggedIn: signal(false),
};
const issueFacadeStub = {
  delete: jest.fn(),
  getAll: jest.fn(() => {
    return fakeIssueData;
  }),
  issues: signal(fakeIssueData).asReadonly,
  titles: signal(fakeIssueTitlesData).asReadonly,
  publishers: signal(fakeIssuePublishersData).asReadonly,
};
const modalDataServiceStub = {
  setDeleteModalOptions: jest.fn(),
};
const titleFacadeStub = {
  getById: jest.fn(() => {
    return fakeTitle;
  }),
};
const routerStub = {
  navigate: jest.fn(),
};
const dialogStub = {
  open: jest.fn(),
  afterClose: jest.fn(),
};

describe('TitleIssueListComponent', () => {
  let component: TitleIssueListComponent;
  let fixture: ComponentFixture<TitleIssueListComponent>;
  let issueFacade: IssueFacade;
  let titleFacade: TitleFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleIssueListComponent],
      providers: [
        { provide: Dialog, useValue: dialogStub },
        { provide: Router, useValue: routerStub },
        { provide: AuthFacade, useValue: authServiceStub },
        { provide: IssueFacade, useValue: issueFacadeStub },
        { provide: ModalDataService, useValue: modalDataServiceStub },
        { provide: TitleFacade, useValue: titleFacadeStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TitleIssueListComponent);
    component = fixture.componentInstance;
    issueFacade = TestBed.inject(IssueFacade);
    titleFacade = TestBed.inject(TitleFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnit', () => {
    it('should call loadData on init', () => {
      const loadDataSpy = jest.spyOn(component, 'loadData');
      component.ngOnInit();
      expect(loadDataSpy).toHaveBeenCalled();
      loadDataSpy.mockClear();
    });
  });

  describe('loadData', () => {
    it('should call getAll', async () => {
      await component.loadData(1);
      expect(issueFacadeStub.getAll).toHaveBeenCalled();
    });

    it('should call getById', async () => {
      await component.loadData(1);
      expect(titleFacade.getById).toHaveBeenCalled();
    });

    it('should set the title signal in the component with title', async () => {
      await component.loadData(1);
      await fixture.detectChanges;
      expect(component.title()).toBe(fakeTitle.title);
    });
  });

  describe('delete', () => {
    it('should call issue service delete method', async () => {
      await component.delete(1);
      expect(issueFacade.delete).toHaveBeenCalled();
    });
  });

  describe('editIssue', () => {
    it('should route to issue page for id', async () => {
      const navigateSpy = jest.spyOn(routerStub, 'navigate');

      await component.editIssue(1);

      expect(navigateSpy).toHaveBeenCalled();

      navigateSpy.mockClear();
    });
  });

  describe('newIssue', () => {
    it('should route to new issue page', async () => {
      const navigateSpy = jest.spyOn(routerStub, 'navigate');

      await component.newIssue();

      expect(navigateSpy).toHaveBeenCalledWith(['/issues/new']);

      navigateSpy.mockClear();
    });
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { IssueService } from '../shared/services/issue.service';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData, fakeTitle } from '../../testing/testing.data';
import TitleIssueListComponent from './title-issue-list.component';
import { AuthService } from '../shared/services/auth.service';
import { TitleService } from '../shared/services/title.service';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

const authServiceStub = {
  isLoggedIn: signal(false),
};
const issueServiceStub = {
  issues: signal(fakeIssueData).asReadonly,
  titles: signal(fakeIssueTitlesData).asReadonly,
  publishers: signal(fakeIssuePublishersData).asReadonly,
  getAll: jest.fn(),
  delete: jest.fn(),
};
const modalDataServiceStub = {
  setDeleteModalOptions: jest.fn(),
};
const titleServiceStub = {
  getById: jest.fn(),
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleIssueListComponent],
      providers: [
        { provide: Dialog, useValue: dialogStub },
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: IssueService, useValue: issueServiceStub },
        { provide: ModalDataService, useValue: modalDataServiceStub },
        { provide: TitleService, useValue: titleServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TitleIssueListComponent);
    component = fixture.componentInstance;
    component.id = 1;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnit', () => {
    it('should call loadData on init', () => {
      const loadDataSpy = jest.spyOn(component, 'loadData');

      component.ngOnInit();

      expect(loadDataSpy).toHaveBeenCalledTimes(1);

      loadDataSpy.mockClear();
    });
  });

  describe('loadData', () => {
    it('should call getAll', async () => {
      const getAllSpy = jest.spyOn(issueServiceStub, 'getAll');
      const getByIdSpy = jest.spyOn(titleServiceStub, 'getById').mockReturnValue(fakeTitle);

      await component.loadData(1);

      expect(getAllSpy).toHaveBeenCalledTimes(1);

      getAllSpy.mockClear();
      getByIdSpy.mockClear();
    });

    it('should call getById', async () => {
      const getAllSpy = jest.spyOn(issueServiceStub, 'getAll');
      const getByIdSpy = jest.spyOn(titleServiceStub, 'getById').mockReturnValue(fakeTitle);

      await component.loadData(1);
      expect(getByIdSpy).toHaveBeenCalledTimes(1);

      getAllSpy.mockClear();
      getByIdSpy.mockClear();
    });

    it('should set the title signal in the component with title', async () => {
      const getAllSpy = jest.spyOn(issueServiceStub, 'getAll');
      const getByIdSpy = jest.spyOn(titleServiceStub, 'getById').mockReturnValue(fakeTitle);

      await component.loadData(1);
      await fixture.detectChanges;

      expect(component.title()).toBe(fakeTitle.title);

      getAllSpy.mockClear();
      getByIdSpy.mockClear();
    });
  });

  describe('delete', () => {
    it('should call issue service delete method', async () => {
      const deleteSpy = jest.spyOn(issueServiceStub, 'delete');

      await component.delete(1);

      expect(deleteSpy).toHaveBeenCalledTimes(1);

      deleteSpy.mockClear();
    });
  });

  describe('editIssue', () => {
    it('should route to issue page for id', async () => {
      const navigateSpy = jest.spyOn(routerStub, 'navigate');

      await component.editIssue(1);

      expect(navigateSpy).toHaveBeenCalledTimes(1);

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

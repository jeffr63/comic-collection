import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { IssueService } from '../shared/services/issue.service';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData, fakeTitle } from '../../testing/testing.data';
import TitleIssueListComponent from './title-issue-list.component';
import { AuthService } from '../shared/services/auth.service';
import { TitleService } from '../shared/services/title.service';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { Router } from '@angular/router';

const authServiceStub = {
  isLoggedIn: signal(false),
};
const dialogStub = {};
const issueServiceStub = {
  issues: signal(fakeIssueData).asReadonly,
  titles: signal(fakeIssueTitlesData).asReadonly,
  publishers: signal(fakeIssuePublishersData).asReadonly,
  getAll: jest.fn(),
  delete: jest.fn(),
};
const modalDataServiceStub = {};
const titleServiceStub = {
  getById: jest.fn(),
};
const routerStub = {
  navigate: jest.fn(),
};

describe('TitleIssueListComponent', () => {
  let component: TitleIssueListComponent;
  let fixture: ComponentFixture<TitleIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleIssueListComponent],
      providers: [
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  //jest.spyOn(router, 'navigate').mockReturnValue(null); and then expect(router.navigate).toHaveBeenCalledWith(['/news']);
});

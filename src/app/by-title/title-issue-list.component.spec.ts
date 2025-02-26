import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

import { describe, expect, jest } from '@jest/globals';

import { AuthDataService } from '../shared/services/auth/auth-data.service';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData, fakeTitle } from '../../testing/testing.data';
import { IssueDataService } from '../shared/services/issue/issue-data.service';
import { ModalDataService } from '../shared/modals/modal-data.service';
import TitleIssueListComponent from './title-issue-list.component';
import { TitleDataService } from '../shared/services/title/title-data.service';
import { DeleteComponent } from '../shared/modals/delete.component';

describe('TitleIssueListComponent', () => {
  let component: TitleIssueListComponent;
  let fixture: ComponentFixture<TitleIssueListComponent>;
  let dialog: Dialog;

  const authServiceStub = {
    isLoggedIn: signal(false),
  };

  const issueFacadeStub = {
    delete: jest.fn((id) => {}),
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
    getById: jest.fn((id: number) => {
      return fakeTitle;
    }),
  };

  const routerStub = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleIssueListComponent, DeleteComponent],
      providers: [
        Dialog,
        { provide: AuthDataService, useValue: authServiceStub },
        { provide: IssueDataService, useValue: issueFacadeStub },
        { provide: ModalDataService, useValue: modalDataServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: TitleDataService, useValue: titleFacadeStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TitleIssueListComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(Dialog);
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
    it('should call getById', async () => {
      await component.loadData(1);
      expect(titleFacadeStub.getById).toHaveBeenCalledWith(1);
    });

    it('should set the title signal in the component with title', async () => {
      await component.loadData(1);
      await fixture.detectChanges;
      expect(component.title()).toBe(fakeTitle.title);
    });
  });

  // describe('deleteIssue', () => {
  //   it('should call modal open', () => {
  //     const dialogOpenSpy = jest.spyOn(dialog, 'open');
  //     component.deleteIssue(1);
  //     expect(dialogOpenSpy).toBeCalled();
  //   });
  // });

  describe('delete', () => {
    it('should call issue service delete method', async () => {
      await component.delete(1);
      expect(issueFacadeStub.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('editIssue', () => {
    it('should route to issue page for id', async () => {
      await component.editIssue(1);
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('newIssue', () => {
    it('should route to new issue page', async () => {
      await component.newIssue();
      expect(routerStub.navigate).toHaveBeenCalledWith(['/issues/new']);
    });
  });
});

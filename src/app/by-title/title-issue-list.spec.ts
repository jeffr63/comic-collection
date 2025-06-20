import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

import { describe, expect, beforeEach, it, vi } from 'vitest';

import { AuthService } from '../shared/services/auth/auth-service';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData, fakeTitle } from '../../testing/testing-data';
import { IssueData } from '../shared/services/issue/issue-data';
import { ModalService } from '../shared/modals/modal-service';
import TitleIssueList from './title-issue-list';
import { TitleData } from '../shared/services/title/title-data';
import { DeleteModal } from '../shared/modals/delete-modal';

describe('TitleIssueListComponent', () => {
  let component: TitleIssueList;
  let fixture: ComponentFixture<TitleIssueList>;
  let dialog: Dialog;

  const authServiceStub = {
    isLoggedIn: signal(false),
  };

  const issueDataStub = {
    delete: vi.fn((id) => {}),
    getAll: vi.fn(() => {
      return fakeIssueData;
    }),
    issues: signal(fakeIssueData).asReadonly,
    titles: signal(fakeIssueTitlesData).asReadonly,
    publishers: signal(fakeIssuePublishersData).asReadonly,
  };

  const modalServiceStub = {
    setDeleteModalOptions: vi.fn(),
  };

  const titleDataStub = {
    getById: vi.fn((id: number) => {
      return fakeTitle;
    }),
  };

  const routerStub = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleIssueList, DeleteModal],
      providers: [
        Dialog,
        { provide: AuthService, useValue: authServiceStub },
        { provide: IssueData, useValue: issueDataStub },
        { provide: ModalService, useValue: modalServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: TitleData, useValue: titleDataStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TitleIssueList);
    component = fixture.componentInstance;
    dialog = TestBed.inject(Dialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnit', () => {
    it('should call loadData on init', () => {
      const loadDataSpy = vi.spyOn(component, 'loadData');
      component.ngOnInit();
      expect(loadDataSpy).toHaveBeenCalled();
      loadDataSpy.mockClear();
    });
  });

  describe('loadData', () => {
    it('should call getById', async () => {
      await component.loadData(1);
      expect(titleDataStub.getById).toHaveBeenCalledWith(1);
    });

    it('should set the title signal in the component with title', async () => {
      await component.loadData(1);
      await fixture.detectChanges;
      expect(component.title()).toBe(fakeTitle.title);
    });
  });

  // describe('deleteIssue', () => {
  //   it('should call modal open', () => {
  //     const dialogOpenSpy = vi.spyOn(dialog, 'open');
  //     component.deleteIssue(1);
  //     expect(dialogOpenSpy).toBeCalled();
  //   });
  // });

  describe('delete', () => {
    it('should call issue service delete method', async () => {
      await component.delete(1);
      expect(issueDataStub.delete).toHaveBeenCalledWith(1);
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

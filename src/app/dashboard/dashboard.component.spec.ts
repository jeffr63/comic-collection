import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard.component';
import { IssueService } from '../shared/services/issue.service';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../testing/testing.data';

const issueServiceStub = {
  issues: signal(fakeIssueData).asReadonly,
  titles: signal(fakeIssueTitlesData).asReadonly,
  publishers: signal(fakeIssuePublishersData).asReadonly,
  getAll: jest.fn(),
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, MatGridListModule, MatCardModule, NgxChartsModule],
      providers: [{ provide: IssueService, useValue: issueServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML test', () => {
    it('should contain one section tag', () => {
      const elements = fixture.debugElement.queryAll(By.css('section'));
      expect(elements.length).toBe(1);
    });

    it('should contain a mat-card-title tag for publishers', () => {
      const elements = fixture.debugElement.queryAll(By.css('mat-card-title'));
      expect(elements[0].nativeElement.textContent).toBe('Issues by Publisher');
    });

    it('should contain a mat-card-title tag for titles', () => {
      const elements = fixture.debugElement.queryAll(By.css('mat-card-title'));
      expect(elements[1].nativeElement.textContent).toBe('Issues by Title');
    });

    it('should contain two charts', () => {
      const elements = fixture.debugElement.queryAll(By.css('ngx-charts-pie-chart'));
      expect(elements.length).toBe(2);
    });
  });

  describe('NgOnInit test', () => {
    it('execute getAll to be called on Init', async () => {
      const getAllSpy = jest.spyOn(issueServiceStub, 'getAll');
      await component.ngOnInit();
      expect(getAllSpy).toHaveBeenCalled();
    });

    it('should declare the issues signal property', () => {
      component.issues = issueServiceStub.issues();
      expect(component.issues()).toEqual(fakeIssueData);
    });

    it('should declare the publishers signal property', () => {
      component.publishers = issueServiceStub.publishers();
      expect(component.publishers()).toEqual(fakeIssuePublishersData);
    });

    it('should declare the titles signal property', () => {
      component.titles = issueServiceStub.titles();
      expect(component.titles()).toEqual(fakeIssueTitlesData);
    });
  });
});

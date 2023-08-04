import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard.component';
import { IssueService } from '../shared/services/issue.service';
import { DOMHelperRoutines } from 'src/testing/dom.helpers';
import { issueData, publisherData, titleData } from 'src/testing/testing.data';

describe('DashboardComponent', () => {
  let comp: DashboardComponent;
  let dh: DOMHelperRoutines<DashboardComponent>;
  let fixture: ComponentFixture<DashboardComponent>;

  const issueServiceStub = {
    issues: signal(issueData).asReadonly,
    titles: signal(titleData).asReadonly,
    publishers: signal(publisherData).asReadonly,
    getAll: jasmine.createSpy('getAll'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, MatGridListModule, MatCardModule, NgxChartsModule],
      providers: [{ provide: IssueService, useValue: issueServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    comp = fixture.componentInstance;
    dh = new DOMHelperRoutines(fixture);
  });

  describe('HTML test', () => {
    it('should create', () => {
      expect(comp).toBeTruthy();
    });

    it('should contain one section tag', () => {
      expect(dh.queryAllCount('section')).toBe(1);
    });

    it('should contain a mat-card-title tag for publishers', () => {
      const elements = dh.queryAll('mat-card-title');
      expect(elements[0].nativeElement.textContent).toBe('Issues by Publisher');
    });

    it('should contain a mat-card-title tag for titles', () => {
      const elements = dh.queryAll('mat-card-title');
      expect(elements[1].nativeElement.textContent).toBe('Issues by Title');
    });

    it('should contain two charts', () => {
      expect(dh.queryAllCount('ngx-charts-pie-chart')).toBe(2);
    });
  });

  describe('NgOnInit', () => {
    it('execute getAll to be called on Init', () => {
      comp.ngOnInit();
      expect(issueServiceStub.getAll).toHaveBeenCalled();
    });

    it('should declare the issues signal property', () => {
      comp.issues = issueServiceStub.issues();
      expect(comp.issues()).toEqual(issueData);
    });

    it('should declare the publishers signal property', () => {
      comp.publishers = issueServiceStub.publishers();
      expect(comp.publishers()).toEqual(publisherData);
    });

    it('should declare the titles signal property', () => {
      comp.titles = issueServiceStub.titles();
      expect(comp.titles()).toEqual(titleData);
    });
  });
});

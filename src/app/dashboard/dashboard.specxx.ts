import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, signal } from '@angular/core';

import { describe, expect } from '@jest/globals';

import { Dashboard } from './dashboard';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../testing/testing-data';
import { IssueChartData } from '../shared/services/issue/issue-data';
import { DashboardContent } from './dashboard-content';
import { Issue, IssueChartData } from '../shared/models/issue-interface';

@Component({ selector: 'app-dashboard-content', template: '' })
export class MockDashboardContentComponent {
  issues = input<Issue[]>([]);
  titles = input<IssueChartData[]>([]);
  publishers = input<IssueChartData[]>([]);
}

describe('DashboardComponent', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const issueDataStub = {
    issues: signal(fakeIssueData).asReadonly,
    titles: signal(fakeIssueTitlesData).asReadonly,
    publishers: signal(fakeIssuePublishersData).asReadonly,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: IssueData, useValue: issueDataStub }],
    })
      .overrideComponent(Dashboard, {
        remove: { imports: [DashboardContent] },
        add: { imports: [MockDashboardContentComponent] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have issues data', () => {
    expect(component.issues()).toEqual(fakeIssueData);
  });

  it('should have titles data', () => {
    expect(component.titles()).toEqual(fakeIssueTitlesData);
  });

  it('should have publishers data', () => {
    expect(component.publishers()).toEqual(fakeIssuePublishersData);
  });
});

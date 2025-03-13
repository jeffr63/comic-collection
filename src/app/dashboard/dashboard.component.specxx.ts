import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, signal } from '@angular/core';

import { describe, expect } from '@jest/globals';

import { DashboardComponent } from './dashboard.component';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../testing/testing.data';
import { IssueDataService } from '../shared/services/issue/issue-data.service';
import { DashboardContentComponent } from './dashboard-content.component';
import { Issue, IssueData } from '../shared/models/issue';

@Component({ selector: 'app-dashboard-content', template: '' })
export class MockDashboardContentComponent {
  issues = input<Issue[]>([]);
  titles = input<IssueData[]>([]);
  publishers = input<IssueData[]>([]);
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const issueDataServiceStub = {
    issues: signal(fakeIssueData).asReadonly,
    titles: signal(fakeIssueTitlesData).asReadonly,
    publishers: signal(fakeIssuePublishersData).asReadonly,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: IssueDataService, useValue: issueDataServiceStub }],
    })
      .overrideComponent(DashboardComponent, {
        remove: { imports: [DashboardContentComponent] },
        add: { imports: [MockDashboardContentComponent] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
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

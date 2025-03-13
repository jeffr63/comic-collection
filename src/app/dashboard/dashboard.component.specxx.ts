import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { describe, expect } from '@jest/globals';

import { DashboardComponent } from './dashboard.component';
import { fakeIssueData, fakeIssuePublishersData, fakeIssueTitlesData } from '../../testing/testing.data';
import { IssueDataService } from '../shared/services/issue/issue-data.service';
import { DashboardContentComponent } from './dashboard-content.component';
import { appConfig } from '../app.config';

@Component({ selector: 'app-dashboard-content', template: '' })
export class MockDashboardContentComponent {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const issueDataServiceStub = {
    issues: signal(fakeIssueData).asReadonly,
    titles: signal(fakeIssueTitlesData).asReadonly,
    publishers: signal(fakeIssuePublishersData).asReadonly,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      Object.assign({}, appConfig, {
        imports: [DashboardComponent, DashboardContentComponent],
        providers: [{ provide: IssueDataService, useValue: issueDataServiceStub }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })
    )
      .overrideComponent(DashboardComponent, {
        remove: { imports: [DashboardContentComponent] },
        add: { imports: [MockDashboardContentComponent] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});

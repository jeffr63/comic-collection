import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { DOMHelperRoutines } from '../../testing/dom.helpers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EntityDataModule } from '@ngrx/data';
import { CourseService } from '../services/issue.service';
import { CourseData } from '../models/issue';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let dh: DOMHelperRoutines<DashboardComponent>;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockCourseService;
  let mockData = [
    {
      id: 1,
      title: '1',
      instructor: '1',
      path: 'Angular',
      source: 'Youtube',
    },
    {
      id: 2,
      title: '2',
      instructor: '2',
      path: 'Angular',
      source: 'Pluralsight',
    },
    {
      id: 3,
      title: '3',
      instructor: '3',
      path: 'React',
      source: 'Pluralsight',
    },
  ];

  let entityMetaData = {
    Courses: {},
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        BrowserAnimationsModule,
        NgxChartsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot({
          entityMetadata: entityMetaData,
        }),
      ],
      providers: [],
    }).compileComponents();
    mockCourseService = TestBed.inject(CourseService);
    spyOn(mockCourseService, 'getAll').and.returnValue(of(mockData));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dh = new DOMHelperRoutines(fixture);
  });

  describe('HTML test', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain one section tag', () => {
      expect(dh.queryAllCount('section')).toBe(1);
    });

    it('should contain a h4 tag for paths', () => {
      const elements = dh.queryAll('h4');
      expect(elements[0].nativeElement.textContent).toBe('Completed Courses - Paths');
    });

    it('should contain a h4 tag for sources', () => {
      const elements = dh.queryAll('h4');
      expect(elements[1].nativeElement.textContent).toBe('Completed Courses - Sources');
    });

    it('should contain two charts', () => {
      expect(dh.queryAllCount('ngx-charts-pie-chart')).toBe(2);
    });
  });

  describe('NgOnInit', () => {
    it('should declare the courses observable property', () => {
      const paths: CourseData[] = [
        { name: 'Angular', value: 2 },
        { name: 'React', value: 1 },
      ];
      fixture.detectChanges();
      component.courses$.subscribe((value) => {
        expect(value).toEqual(paths);
      });
    });

    it('should declare the sourses observable property', () => {
      const sources: CourseData[] = [
        { name: 'Pluralsight', value: 2 },
        { name: 'Youtube', value: 1 },
      ];
      fixture.detectChanges();
      component.sources$.subscribe((value) => {
        expect(value).toEqual(sources);
      });
    });
  });
});

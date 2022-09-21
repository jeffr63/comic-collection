import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../services/title.service';
import { IssueService } from '../issues/issue.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Title } from '../models/title';
import { Issue } from '../models/issue';
import { Column } from '../models/column';
import { DisplayTableComponent } from '../shared/display-table.component';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataService } from '../modals/modal-data.service';
import { DeleteComponent } from '../modals/delete.component';

@Component({
  selector: 'app-title-issue-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="issues"
        [includeAdd]="true"
        [isAuthenticated]="authService.isAuthenticated"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="issues"
        [tableColumns]="columns"
        (add)="newIssue()"
        (delete)="deleteIssue($event)"
        (edit)="editIssue($event)"
      ></app-display-table>
    </section>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      section {
        margin: 10px 20px;
      }
    `,
  ],
})
export class TitleIssueListComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      key: 'title',
      name: 'Title',
      width: '600px',
      type: 'sort',
      position: 'left',
      sortDefault: true,
    },
    {
      key: 'publisher',
      name: 'Publisher',
      width: '400px',
      type: 'sort',
      position: 'left',
    },
    {
      key: 'issue',
      name: 'Issue Number',
      width: '50px',
      type: 'sort',
      position: 'left',
    },
    {
      key: 'coverPrice',
      name: 'Cover Price',
      width: '50px',
      type: 'currency_sort',
      position: 'left',
    },
    {
      key: 'url',
      name: 'Url',
      width: '200px',
      type: 'link',
      position: 'left',
    },
    {
      key: 'action',
      name: '',
      width: '50px',
      type: 'action',
      position: 'left',
    },
  ];
  issues: Issue[] = [];
  componentIsDestroyed = new Subject<boolean>();
  title = '';

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private titleService: TitleService,
    private issueService: IssueService,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
  }

  loadData() {
    this.route.params.subscribe((params) => {
      this.titleService
        .getByKey(params['id'])
        .pipe(take(1))
        .subscribe({
          next: (title: Title) => {
            this.title = title.title;
            this.getIssuesForTitle(title.title);
          },
        });
    });
  }

  getIssuesForTitle(title: string) {
    this.issueService
      .getAll()
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe({
        next: (data) => {
          this.issues = data.filter((issue) => issue.title === title);
        },
      });
  }

  deleteIssue(id: number) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.issueService.delete(id);
          this.getIssuesForTitle(this.title);
        }
      });
  }

  editIssue(id: number) {
    this.router.navigate(['/issues', id]);
  }

  newIssue() {
    this.router.navigate(['/issues/new']);
  }
}

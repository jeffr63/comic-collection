import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { Issue } from '../models/issue';
import { ModalDataService } from '../modals/modal-data.service';
import { TitleService } from '../services/title.service';
import { IssueService } from '../issues/issue.service';
import { Title } from '../models/title';

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
        [tableData]="issues()"
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
export default class TitleIssueListComponent implements OnInit {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  titleService = inject(TitleService);
  issueService = inject(IssueService);
  modalDataService = inject(ModalDataService);
  router = inject(Router);

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
      name: 'Link',
      width: '20px',
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
  issues = signal<Issue[]>([]);
  title = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.loadData(parseInt(id));
    }
  }

  async loadData(id: number) {
    const title = (await this.titleService.getById(id)) as unknown as Title;
    this.title = title.title;
    await this.getIssuesForTitle(title.title);
  }

  async getIssuesForTitle(title: string) {
    const issues = await this.issueService.search(`title=${title}`);
    this.issues.set(issues);
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
          this.delete(id);
        }
      });
  }

  async delete(id: number) {
    await this.issueService.delete(id);
    this.getIssuesForTitle(this.title);
  }

  editIssue(id: number) {
    this.router.navigate(['/issues', id]);
  }

  newIssue() {
    this.router.navigate(['/issues/new']);
  }
}

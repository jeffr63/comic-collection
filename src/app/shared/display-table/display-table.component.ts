import { CurrencyPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  effect,
  input,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortable, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Column } from '../models/column';

@Component({
  selector: 'app-display-table',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    CurrencyPipe,
    NgClass,
  ],
  template: `
    <ng-container>
      <!-- Filter -->
      @if (isFilterable) {
      <ng-container>
        <mat-form-field appearance="outline">
          <mat-label>Filter </mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="filter" />
        </mat-form-field>
      </ng-container>
      }

      <!-- Add Button -->
      @if (includeAdd) {
      <ng-container>
        @if (isAuthenticated()) {
        <a mat-mini-fab color="primary" title="Add new" aria-label="Add new" class="ml-5 fl1" (click)="emitAdd()">
          <mat-icon>add</mat-icon>
        </a>
        }
      </ng-container>
      }

      <!-- Table -->
      <table mat-table [dataSource]="tableDataSource" matSort class="mat-elevation-z8">
        @for (column of tableColumns; track column) {
        <ng-container [matColumnDef]="column.key">
          @switch (column.type) { @case ('sort') {
          <ng-container>
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
              [class.text-right]="column.position === 'right'"
              [arrowPosition]="column.position === 'right' ? 'before' : 'after'"
              style="min-width: {{ column.width }}">
              {{ column.name }}
            </th>
            <td mat-cell *matCellDef="let element">
              {{ element[column.key] }}
            </td>
          </ng-container>
          } @case ('currency_sort') {
          <ng-container>
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
              [class.text-right]="column.position === 'right'"
              [arrowPosition]="column.position === 'right' ? 'before' : 'after'"
              style="min-width: {{ column.width }}">
              {{ column.name }}
            </th>
            <td mat-cell *matCellDef="let element">
              {{ element[column.key] | currency }}
            </td>
          </ng-container>
          } @case ('link') {
          <ng-container>
            <th
              mat-header-cell
              *matHeaderCellDef
              [class.text-right]="column.position === 'right'"
              style="min-width: {{ column.width }}">
              {{ column.name }}
            </th>
            <td mat-cell *matCellDef="let element">
              @if (element[column.key]) {
              <a href="{{ element[column.key] }}"><mat-icon>link</mat-icon></a>
              }
            </td>
          </ng-container>
          } @case ('action') {
          <ng-container>
            <th
              mat-header-cell
              *matHeaderCellDef
              [class.text-right]="column.position === 'right'"
              style="min-width: {{ column.width }}"></th>
            <td mat-cell *matCellDef="let element">
              @if (isAuthenticated()) {
              <button mat-icon-button color="primary" (click)="emitEdit(element.id)" title="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="emitDelete(element.id)" title="Delete">
                <mat-icon>delete</mat-icon>
              </button>
              }
            </td>
          </ng-container>
          } @case ('view') {
          <ng-container>
            <th
              mat-header-cell
              *matHeaderCellDef
              [class.text-right]="column.position === 'right'"
              style="min-width: {{ column.width }}"></th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" (click)="emitOpen(element.id)" title="View">
                <mat-icon>view_list</mat-icon>
              </button>
            </td>
          </ng-container>
          } @default {
          <ng-container>
            <th
              mat-header-cell
              *matHeaderCellDef
              [class.text-right]="column.position === 'right'"
              style="min-width: {{ column.width }}">
              {{ column.name }}
            </th>
            <td mat-cell *matCellDef="let element">
              {{ element[column.key] }}
            </td>
          </ng-container>
          } }
        </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns; let even = even" [ngClass]="{ gray: even }"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="5">No data matching the filter</td>
        </tr>
      </table>

      <!-- Pagination -->
      @if (isPageable) {
      <mat-paginator [pageSizeOptions]="paginationSizes" [pageSize]="defaultPageSize" showFirstLastButtons>
      </mat-paginator>
      }
    </ng-container>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      th,
      td {
        padding: 10px !important;
      }
      mat-form-field {
        width: 40%;
      }
      .text-right {
        text-align: right !important;
      }
      .ml-5 {
        margin-left: 5px;
      }
      .fl1 {
        float: right;
        vertical-align: middle;
      }
      .mat-mdc-form-field {
        font-size: 14px;
        width: 80%;
      }
    `,
  ],
})
export class DisplayTableComponent implements OnInit {
  // input parms
  isAuthenticated = input(false);
  @Input() defaultPageSize = 10;
  @Input() disableClear = false;
  @Input() isFilterable = false;
  @Input() isPageable = false;
  @Input() includeAdd = false;
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input({ required: true }) tableColumns: Column[] = [];
  tableData = input.required<any[]>();
  public tableDataSource = new MatTableDataSource([]);

  // output parms
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<number> = new EventEmitter();
  @Output() edit: EventEmitter<number> = new EventEmitter();
  @Output() open: EventEmitter<number> = new EventEmitter();

  // signals and computed values
  matPaginator = viewChild(MatPaginator);
  matSort = viewChild.required(MatSort);
  public displayedColumns: String[] = [];

  constructor() {
    effect(() => this.setTableDataSource(this.tableData()));
    effect(() => (this.tableDataSource.paginator = this.matPaginator()!));
  }

  ngOnInit(): void {
    let defaultSort = '';
    this.tableColumns.map((column: Column) => {
      if (column.sortDefault) {
        defaultSort = column.key;
      }
    });
    if (defaultSort !== '') {
      this.matSort().sort({ id: defaultSort, start: 'asc' } as MatSortable);
    }
    this.displayedColumns = this.tableColumns.map((column: Column) => column.key);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  emitAdd() {
    this.add.emit();
  }

  emitDelete(id: number) {
    this.delete.emit(id);
  }

  emitEdit(id: number) {
    this.edit.emit(id);
  }

  emitOpen(id: number) {
    this.open.emit(id);
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource(data);
    this.tableDataSource.paginator = this.matPaginator()!;
    this.matSort().disableClear = this.disableClear;
    this.tableDataSource.sort = this.matSort();
  }
}

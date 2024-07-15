import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, OnInit, computed, effect, input, output, viewChild } from '@angular/core';
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
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, CurrencyPipe, NgClass],
  template: `
    <!-- Filter -->
    @if (isFilterable()) {
    <mat-form-field appearance="outline">
      <mat-label>Filter </mat-label>
      <input matInput (keyup)="applyFilter($event)" placeholder="filter" />
    </mat-form-field>
    }

    <!-- Add Button -->
    @if (includeAdd() && isAuthenticated()) {
    <a mat-mini-fab color="primary" title="Add new" aria-label="Add new" class="ml-5 fl1" (click)="emitAdd()">
      <mat-icon>add</mat-icon>
    </a>
    }

    <!-- Table -->
    <table mat-table [dataSource]="tableDataSource" matSort class="mat-elevation-z8">
      @for (column of tableColumns(); track $index) {
      <ng-container [matColumnDef]="column.key">
        @switch (column.type) { @case ('sort') {
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
        } @case ('currency_sort') {
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
        } @case ('link') {
        <th mat-header-cell *matHeaderCellDef [class.text-right]="column.position === 'right'" style="min-width: {{ column.width }}">
          {{ column.name }}
        </th>
        <td mat-cell *matCellDef="let element">
          @if (element[column.key]) {
          <a href="{{ element[column.key] }}"><mat-icon>link</mat-icon></a>
          }
        </td>
        } @case ('action') {
        <th mat-header-cell *matHeaderCellDef [class.text-right]="column.position === 'right'" style="min-width: {{ column.width }}"></th>
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
        } @case ('view') {
        <th mat-header-cell *matHeaderCellDef [class.text-right]="column.position === 'right'" style="min-width: {{ column.width }}"></th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" (click)="emitOpen(element.id)" title="View">
            <mat-icon>view_list</mat-icon>
          </button>
        </td>
        } @default {
        <th mat-header-cell *matHeaderCellDef [class.text-right]="column.position === 'right'" style="min-width: {{ column.width }}">
          {{ column.name }}
        </th>
        <td mat-cell *matCellDef="let element">
          {{ element[column.key] }}
        </td>
        } }
      </ng-container>
      }

      <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns(); let even = even" [ngClass]="{ gray: even }"></tr>

      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="5">No data matching the filter</td>
      </tr>
    </table>

    <!-- Pagination -->
    @if (isPageable()) {
    <mat-paginator [pageSizeOptions]="paginationSizes()" [pageSize]="defaultPageSize()" showFirstLastButtons> </mat-paginator>
    }
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
export class DisplayTableComponent<TData> implements OnInit {
  // input parms
  defaultPageSize = input(10);
  disableClear = input(false);
  includeAdd = input(false);
  isAuthenticated = input(false);
  isFilterable = input(false);
  isPageable = input(false);
  paginationSizes = input<number[]>([5, 10, 15]);
  tableColumns = input.required<Column[]>();
  tableData = input.required<TData[]>();
  public tableDataSource = new MatTableDataSource([]);

  // output parms
  add = output();
  delete = output<number>();
  edit = output<number>();
  open = output<number>();

  // signals and computed values
  matPaginator = viewChild(MatPaginator);
  matSort = viewChild.required(MatSort);
  public displayedColumns = computed<String[]>(() => this.tableColumns().map((column: Column) => column.key));

  constructor() {
    effect(() => this.setTableDataSource(this.tableData()));
    effect(() => (this.tableDataSource.paginator = this.matPaginator()!));
  }

  ngOnInit(): void {
    let defaultSort = '';
    this.tableColumns().map((column: Column) => {
      if (column.sortDefault) {
        defaultSort = column.key;
      }
    });
    if (defaultSort !== '') {
      this.matSort().sort({ id: defaultSort, start: 'asc' } as MatSortable);
    }
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
    this.matSort().disableClear = this.disableClear();
    this.tableDataSource.sort = this.matSort();
  }
}

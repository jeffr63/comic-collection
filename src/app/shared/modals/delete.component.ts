import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ModalDataService } from './modal-data.service';

@Component({
    selector: 'app-delete',
    imports: [MatDialogModule, MatIconModule, MatButtonModule],
    template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Delete?</h2>
      <mat-dialog-content>
        <p>
          <strong>{{ modalOptions.title }}</strong>
        </p>
        <p>
          {{ modalOptions.body }}
          @if (modalOptions.warning) {
          <span class="text-danger">{{ modalOptions.warning }}</span>
          }
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="warn" (click)="dialog.close('delete')" title="Delete">
          <mat-icon>delete</mat-icon> Delete
        </button>
        <button mat-flat-button color="accent" (click)="dialog.close()" title="Cancel" class="ml-10">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-dialog-actions>
    </div>
  `,
    styles: [
        `
      .ml-10 {
        margin-left: 10px;
      }
    `,
    ]
})
export class DeleteComponent implements OnInit {
  public dialog = inject(MatDialogRef<DeleteComponent>);
  private modalDataService = inject(ModalDataService);

  modalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  ngOnInit() {
    this.modalOptions = this.modalDataService.getDeleteModalOptions();
  }
}

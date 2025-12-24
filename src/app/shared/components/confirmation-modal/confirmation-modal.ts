import { Component, inject, input } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Button } from '../button/button';
import { CommonModule } from '@angular/common';

export interface ConfirmationModalData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [MatDialogModule, Button, CommonModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationModal {
  dialogRef = inject(MatDialogRef<ConfirmationModal>);
  data = inject(MAT_DIALOG_DATA) as ConfirmationModalData;

  title = this.data.title || 'Confirm';
  message = this.data.message || 'Are you sure?';
  confirmText = this.data.confirmText || 'Confirm';
  cancelText = this.data.cancelText || 'Cancel';

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}


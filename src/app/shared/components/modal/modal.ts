import { Component, inject, output, input } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  dialogRef = inject(MatDialogRef);
  title = input<string>('Dialog');
  close = output<void>();

  onClose() {
    this.close.emit();
    this.dialogRef.close();
  }
}

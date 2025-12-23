import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  dialogRef = inject(MatDialogRef);

  close() {
    this.dialogRef.close();
  }

}

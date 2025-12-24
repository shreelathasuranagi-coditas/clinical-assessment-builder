import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AssessmentMetadata } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-create-assessment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-assessment-dialog.component.html',
  styleUrl: './create-assessment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAssessmentDialogComponent {
  dialogRef = inject(MatDialogRef<CreateAssessmentDialogComponent>);

  categories = [
    'Oncology',
    'Hereditary Cancer',
    'Reproductive Health',
    'Other',
  ];

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  submit(): void {
    if (this.form.valid) {
      const result: AssessmentMetadata = {
        name: this.form.get('name')?.value || '',
        category: this.form.get('category')?.value as any,
        description: this.form.get('description')?.value || '',
      };
      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}

import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-assessment',
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
  templateUrl: './create-assessment.html',
  styleUrl: './create-assessment.scss',
})
export class CreateAssessment {
  private dialogRef = inject(MatDialogRef<CreateAssessment>);

  // category_id mapping (matches backend)
  categories = [
    { id: 1, label: 'Oncology' },
    { id: 2, label: 'Hereditary Cancer' },
    { id: 3, label: 'Reproductive Health' },
    { id: 4, label: 'Other' },
  ];

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category_id: new FormControl<number | null>(null, Validators.required),
    description: new FormControl(''),
  });

  submit(): void {
    if (!this.form.valid) return;

    this.dialogRef.close({
      name: this.form.value.name!,
      category_id: this.form.value.category_id!,
      description: this.form.value.description || '',
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}

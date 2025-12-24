import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AssessmentService } from '../../../core/services/assessment-service';
import { Assessment } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-assessment-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './assessment-details.component.html',
  styleUrl: './assessment-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentDetailsComponent implements OnInit {
  assessmentService = inject(AssessmentService);
  route = inject(ActivatedRoute);
  router = inject(Router);

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

  assessment = this.assessmentService.currentAssessment;
  loading = false;

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (assessmentId) {
      const assessment = this.assessmentService.getAssessment(assessmentId);
      if (assessment) {
        this.assessmentService.setCurrentAssessment(assessmentId);
        this.form.patchValue({
          name: assessment.name,
          category: assessment.category,
          description: assessment.description,
        });
      }
    }
  }

  save(): void {
    if (this.form.valid && this.assessment()) {
      const assessmentId = this.assessment()!.id;
      this.assessmentService.updateAssessmentMetadata(assessmentId, {
        name: this.form.get('name')?.value || '',
        category: this.form.get('category')?.value as any,
        description: this.form.get('description')?.value || '',
      });
    }
  }

  goToQuestionBuilder(): void {
    if (this.assessment()) {
      this.router.navigate(['/assessment', this.assessment()!.id, 'builder']);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

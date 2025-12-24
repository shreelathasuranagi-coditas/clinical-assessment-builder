import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AssessmentService } from '../../../core/services/assessment-service';
import { Assessment } from '../../../core/models/assessment.model';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { Button } from '../../../shared/components/button/button';

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
    MatIconModule,
    MatCardModule,
    CustomInput,
    Button,
  ],
  templateUrl: './assessment-details.html',
  styleUrl: './assessment-details.scss',
})
export class AssessmentDetails implements OnInit {
  private assessmentService = inject(AssessmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // backend-aligned category list
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

  assessment = this.assessmentService.currentAssessment;

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (!assessmentId) return;

    const assessment = this.assessmentService.getAssessment(assessmentId);
    if (!assessment) return;

    this.assessmentService.setCurrentAssessment(assessmentId);

    this.form.patchValue({
      name: assessment.name,
      category_id: assessment.category_id,
      description: assessment.description,
    });
  }

  save(): void {
    const current = this.assessment();
    if (!current || this.form.invalid) return;

    this.assessmentService.updateAssessment(current.assessment_id, {
      name: this.form.value.name!,
      category_id: this.form.value.category_id!,
      description: this.form.value.description || '',
    });
  }

  goToQuestionBuilder(): void {
    const current = this.assessment();
    if (!current) return;

    this.router.navigate([
      '/assessment',
      current.assessment_id,
      'builder',
    ]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

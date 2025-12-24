import { Component, inject, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssessmentService } from '../../../core/services/assessment-service';
import { Question } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit {
  assessmentService = inject(AssessmentService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  assessment = this.assessmentService.currentAssessment;
  currentStep = signal(0);
  formValues = signal<{ [key: string]: any }>({});

  visibleQuestions = computed(() => {
    const assessment = this.assessment();
    if (!assessment) return [];

    const sorted = [...assessment.questions].sort((a, b) => a.order - b.order);
    const answers = this.formValues();

    return sorted.filter(question => {
      if (!question.conditional) return true;

      const conditionQuestion = assessment.questions.find(
        q => q.id === question.conditional!.questionId
      );
      if (!conditionQuestion) return true;

      const answerValue = answers[conditionQuestion.id];
      return answerValue === question.conditional.value;
    });
  });

  currentQuestion = computed(() => {
    const visible = this.visibleQuestions();
    return visible[this.currentStep()] || null;
  });

  isLastQuestion = computed(() => {
    return this.currentStep() >= this.visibleQuestions().length - 1;
  });

  isFirstQuestion = computed(() => {
    return this.currentStep() === 0;
  });

  form = new FormGroup({
    answer: new FormControl(''),
  });

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (assessmentId) {
      const assessment = this.assessmentService.getAssessment(assessmentId);
      if (assessment) {
        this.assessmentService.setCurrentAssessment(assessmentId);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  next(): void {
    const currentQuestion = this.currentQuestion();
    if (currentQuestion) {
      const value = this.form.get('answer')?.value;
      if (currentQuestion.type === 'multi_choice') {
        // For multi-choice, value would be an array
        const current = this.formValues();
        current[currentQuestion.id] = value || [];
        this.formValues.set(current);
      } else {
        // For single choice and short text
        if (currentQuestion.required && !value) {
          alert('This field is required');
          return;
        }
        const current = this.formValues();
        current[currentQuestion.id] = value;
        this.formValues.set(current);
      }

      if (!this.isLastQuestion()) {
        this.currentStep.update(step => step + 1);
        this.form.reset();
      }
    }
  }

  back(): void {
    if (!this.isFirstQuestion()) {
      this.currentStep.update(step => step - 1);
      const prevQuestion = this.visibleQuestions()[this.currentStep()];
      if (prevQuestion) {
        this.form.patchValue({
          answer: this.formValues()[prevQuestion.id],
        });
      }
    }
  }

  close(): void {
    this.router.navigate(['/assessment', this.assessment()?.id, 'builder']);
  }

  getQuestionDisplay(question: Question): string {
    if (question.type === 'single_choice' || question.type === 'multi_choice') {
      return `${question.text} (${question.required ? 'Required' : 'Optional'})`;
    }
    return `${question.text}${question.required ? ' *' : ''}`;
  }
}

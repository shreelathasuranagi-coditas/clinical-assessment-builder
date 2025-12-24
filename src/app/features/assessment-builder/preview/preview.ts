import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AssessmentService } from '../../../core/services/assessment-service';
import { Question } from '../../../core/models/question.model';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Preview implements OnInit {
  private assessmentService = inject(AssessmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  assessment = this.assessmentService.currentAssessment;

  currentStep = signal(0);
  formValues = signal<Record<string, any>>({});

  form = new FormGroup({
    answer: new FormControl(''),
  });

  // Track selected checkboxes for multi-choice questions
  selectedCheckboxes = signal<Record<string, boolean>>({});

  // ---------------------------
  // Computed state
  // ---------------------------
  visibleQuestions = computed(() => {
    const assessment = this.assessment();
    
    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
      console.log('Preview - No questions found in assessment');
      return [];
    }

    // Sort questions by order
    const sorted = [...assessment.questions].sort(
      (a, b) => a.order - b.order
    );
    
    console.log('Preview - Sorted questions:', sorted);

    // For now, return all sorted questions (no conditional filtering to simplify debugging)
    return sorted;
  });

  currentQuestion = computed(() => {
    const questions = this.visibleQuestions();
    const question = questions[this.currentStep()] ?? null;
    console.log('Preview - Current question at step', this.currentStep(), ':', question);
    return question;
  });

  isLastQuestion = computed(() => {
    return this.currentStep() >= this.visibleQuestions().length - 1;
  });

  isFirstQuestion = computed(() => {
    return this.currentStep() === 0;
  });

  // ---------------------------
  // Lifecycle
  // ---------------------------
  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (!assessmentId) {
      console.error('No assessment ID found in route');
      this.router.navigate(['/dashboard']);
      return;
    }

    const assessment = this.assessmentService.getAssessment(assessmentId);
    if (!assessment) {
      console.error('Assessment not found:', assessmentId);
      this.router.navigate(['/dashboard']);
      return;
    }

    // Set the current assessment
    this.assessmentService.setCurrentAssessment(assessmentId);
    
    // Trigger change detection to ensure computed properties update
    this.cdr.markForCheck();
    
    // Log to verify assessment is loaded - using setTimeout to ensure signal update
    setTimeout(() => {
      console.log('Assessment loaded for preview:', this.assessment());
      console.log('Questions in assessment:', this.assessment()?.questions);
      console.log('Visible questions:', this.visibleQuestions());
      this.cdr.markForCheck();
    }, 0);
  }

  // ---------------------------
  // Navigation
  // ---------------------------
  next(): void {
    const question = this.currentQuestion();
    if (!question) return;

    let value: any;
    
    // Handle multi-choice checkboxes differently
    if (question.type === 'multi_choice') {
      value = this.getSelectedCheckboxes().join(', ');
    } else {
      value = this.form.value.answer;
    }

    const current = { ...this.formValues() };

    if (question.required && !value) {
      alert('This field is required');
      return;
    }

    current[question.id] = value;
    this.formValues.set(current);

    if (!this.isLastQuestion()) {
      this.currentStep.update((s) => s + 1);
      this.form.reset();
      // Reset checkboxes for next question
      this.selectedCheckboxes.set({});
    }
  }

  back(): void {
    if (this.isFirstQuestion()) return;

    this.currentStep.update((s) => s - 1);
    const prev = this.visibleQuestions()[this.currentStep()];

    if (prev) {
      if (prev.type === 'multi_choice') {
        // Restore checkbox values from previous answer
        const prevAnswer = this.formValues()[prev.id];
        if (prevAnswer) {
          const checkboxes: Record<string, boolean> = {};
          prevAnswer.split(', ').forEach((option: string) => {
            checkboxes[option.trim()] = true;
          });
          this.selectedCheckboxes.set(checkboxes);
        } else {
          this.selectedCheckboxes.set({});
        }
      } else {
        this.form.patchValue({
          answer: this.formValues()[prev.id],
        });
        this.selectedCheckboxes.set({});
      }
    }
  }

  close(): void {
    const assessment = this.assessment();
    if (!assessment) return;

    this.router.navigate([
      '/assessment',
      assessment.assessment_id,
      'builder',
    ]);
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  getQuestionDisplay(question: Question): string {
    return `${question.text}${question.required ? ' *' : ''}`;
  }

  onCheckboxChange(option: string, checked: boolean): void {
    const current = { ...this.selectedCheckboxes() };
    if (checked) {
      current[option] = true;
    } else {
      delete current[option];
    }
    this.selectedCheckboxes.set(current);
  }

  getSelectedCheckboxes(): string[] {
    return Object.keys(this.selectedCheckboxes()).filter(
      (key) => this.selectedCheckboxes()[key]
    );
  }
}

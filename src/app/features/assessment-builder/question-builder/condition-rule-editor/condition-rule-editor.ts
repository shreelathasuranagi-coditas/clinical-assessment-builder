import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AssessmentService } from '../../../../core/services/assessment-service';
import {
  Question,
  ConditionalRule,
} from '../../../../core/models/question.model';
import { CustomInput } from '../../../../shared/components/custom-input/custom-input';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-condition-rule-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CustomInput,
    Button,
  ],
  templateUrl: './condition-rule-editor.html',
  styleUrl: './condition-rule-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionRuleEditor implements OnInit {
  private assessmentService = inject(AssessmentService);

  @Input() assessmentId = '';
  @Input() currentQuestion: Question | null = null;
  @Output() ruleChanged = new EventEmitter<void>();

  form = new FormGroup({
    questionId: new FormControl<string | null>(null),
    value: new FormControl<string | null>(null),
  });

  // -----------------------------
  // Computed state
  // -----------------------------
  previousQuestions = computed(() => {
    if (!this.assessmentId || !this.currentQuestion) return [];

    const assessment =
      this.assessmentService.getAssessment(this.assessmentId);

    return assessment?.questions
      ? assessment.questions.filter(
          (q) => q.order < this.currentQuestion!.order
        )
      : [];
  });

  selectedQuestion = computed(() => {
    const questionId = this.form.value.questionId;
    if (!questionId) return null;

    const assessment =
      this.assessmentService.getAssessment(this.assessmentId);

    return assessment?.questions?.find((q) => q.id === questionId) ?? null;
  });

  availableValues = computed(() => {
    const question = this.selectedQuestion();
    if (
      question &&
      (question.type === 'single_choice' ||
        question.type === 'multi_choice')
    ) {
      return question.options.map((opt) => opt.text);
    }
    return [];
  });

  hasRule = computed(() => {
    return this.currentQuestion?.conditional !== null;
  });

  // -----------------------------
  // Lifecycle
  // -----------------------------
  ngOnInit(): void {
    this.loadRule();
  }

  private loadRule(): void {
    if (!this.currentQuestion?.conditional) return;

    const rule = this.currentQuestion.conditional;
    this.form.patchValue({
      questionId: rule.questionId,
      value: rule.value,
    });
  }

  // -----------------------------
  // Actions
  // -----------------------------
  saveRule(): void {
    if (!this.currentQuestion) return;

    const { questionId, value } = this.form.value;
    if (!questionId || !value) return;

    const rule: ConditionalRule = {
      questionId,
      value,
    };

    const updatedQuestion: Question = {
      ...this.currentQuestion,
      conditional: rule,
    };

    this.assessmentService.updateQuestion(
      this.assessmentId,
      updatedQuestion
    );

    this.ruleChanged.emit();
  }

  clearRule(): void {
    if (!this.currentQuestion) return;

    const updatedQuestion: Question = {
      ...this.currentQuestion,
      conditional: null,
    };

    this.assessmentService.updateQuestion(
      this.assessmentId,
      updatedQuestion
    );

    this.form.reset();
    this.ruleChanged.emit();
  }
}

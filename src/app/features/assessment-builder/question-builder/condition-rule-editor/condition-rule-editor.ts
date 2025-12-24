import { Component, inject, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { Question, ConditionalRule } from '../../../../core/models/assessment.model';

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
  ],
  templateUrl: './condition-rule-editor.html',
  styleUrl: './condition-rule-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionRuleEditor {
  assessmentService = inject(AssessmentService);

  @Input() assessmentId: string = '';
  @Input() currentQuestion: Question | null = null;
  @Output() ruleChanged = new EventEmitter<void>();

  form = new FormGroup({
    questionId: new FormControl(''),
    value: new FormControl(''),
  });

  previousQuestions = computed(() => {
    const assessment = this.assessmentService.getAssessment(this.assessmentId);
    if (!assessment || !this.currentQuestion) return [];

    return assessment.questions.filter(
      q => q.order < this.currentQuestion!.order
    );
  });

  selectedQuestion = computed(() => {
    const questionId = this.form.get('questionId')?.value;
    const assessment = this.assessmentService.getAssessment(this.assessmentId);
    return assessment?.questions.find(q => q.id === questionId);
  });

  availableValues = computed(() => {
    const question = this.selectedQuestion();
    if (
      question &&
      (question.type === 'single_choice' || question.type === 'multi_choice')
    ) {
      return question.options.map(opt => opt.text);
    }
    return [];
  });

  hasRule = computed(() => {
    return this.currentQuestion?.conditional !== null;
  });

  ngOnInit(): void {
    this.loadRule();
  }

  private loadRule(): void {
    if (this.currentQuestion?.conditional) {
      const rule = this.currentQuestion.conditional;
      this.form.patchValue({
        questionId: rule.questionId,
        value: rule.value,
      });
    }
  }

  saveRule(): void {
    const questionId = this.form.get('questionId')?.value;
    const value = this.form.get('value')?.value;

    if (!questionId || !value || !this.currentQuestion) return;

    const rule: ConditionalRule = {
      questionId,
      value,
    };

    const updatedQuestion: Question = {
      ...this.currentQuestion,
      conditional: rule,
    };

    this.assessmentService.updateQuestion(this.assessmentId, updatedQuestion);
    this.ruleChanged.emit();
  }

  clearRule(): void {
    if (!this.currentQuestion) return;

    const updatedQuestion: Question = {
      ...this.currentQuestion,
      conditional: null,
    };

    this.assessmentService.updateQuestion(this.assessmentId, updatedQuestion);
    this.form.reset();
    this.ruleChanged.emit();
  }
}

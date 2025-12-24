import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

import { AssessmentService } from '../../../../core/services/assessment-service';
import { Question, QuestionType } from '../../../../core/models/question.model';
import { ConditionRuleEditor } from '../condition-rule-editor/condition-rule-editor';
import { CustomInput } from '../../../../shared/components/custom-input/custom-input';
import { Button } from '../../../../shared/components/button/button';
@Component({
  selector: 'app-question-editor',
  standalone: true,
  imports: [
  CommonModule,
  ReactiveFormsModule,

  // Angular Material
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatExpansionModule,

  // Pipe
  TitleCasePipe,

  // Custom Components
  CustomInput,
  Button,

  ConditionRuleEditor,
],
  templateUrl: './question-editor.html',
  styleUrl: './question-editor.scss',
})
export class QuestionEditor implements OnInit {
  private assessmentService = inject(AssessmentService);

  @Input() assessmentId = '';
  @Input() questionId = '';
  @Output() questionSaved = new EventEmitter<void>();

  questionTypes: QuestionType[] = [
    'single_choice',
    'multi_choice',
    'short_text',
  ];

  form = new FormGroup({
    text: new FormControl('', Validators.required),
    type: new FormControl<QuestionType>('single_choice', Validators.required),
    required: new FormControl(false),
    options: new FormArray([]),
  });

  currentQuestion: Question | null = null;

  ngOnInit(): void {
    this.loadQuestion();
  }

  // -------------------------
  // Load existing question
  // -------------------------
  private loadQuestion(): void {
    const assessment = this.assessmentService.getAssessment(this.assessmentId);
    if (!assessment || !assessment.questions) return;

    const question = assessment.questions.find(
      (q) => q.id === this.questionId
    );

    if (!question) return;

    this.currentQuestion = question;

    this.form.patchValue({
      text: question.text,
      type: question.type,
      required: question.required,
    });

    this.optionsArray.clear();

    question.options.forEach((option) => {
      this.optionsArray.push(
        new FormGroup({
          id: new FormControl(option.id),
          text: new FormControl(option.text, Validators.required),
        })
      );
    });

    this.updateOptionsVisibility();
  }

  // -------------------------
  // Getters
  // -------------------------
  get optionsArray(): FormArray {
    return this.form.get('options') as FormArray;
  }

  get typeValue(): QuestionType {
    return this.form.get('type')!.value!;
  }

  get isChoiceType(): boolean {
    return (
      this.typeValue === 'single_choice' ||
      this.typeValue === 'multi_choice'
    );
  }

  // -------------------------
  // Options handling
  // -------------------------
  addOption(): void {
    this.optionsArray.push(
      new FormGroup({
        id: new FormControl(crypto.randomUUID()),
        text: new FormControl('', Validators.required),
      })
    );
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  onTypeChange(): void {
    if (!this.isChoiceType) {
      this.optionsArray.clear();
    }
    this.updateOptionsVisibility();
  }

  private updateOptionsVisibility(): void {
    this.isChoiceType
      ? this.optionsArray.enable()
      : this.optionsArray.disable();
  }

  // -------------------------
  // Save
  // -------------------------
  save(): void {
    if (!this.form.valid || !this.currentQuestion) return;

    const options = this.isChoiceType
      ? this.optionsArray.getRawValue()
      : [];

    const updatedQuestion: Question = {
      ...this.currentQuestion,
      text: this.form.value.text!,
      type: this.form.value.type!,
      required: this.form.value.required ?? false,
      options,
    };

    this.assessmentService.updateQuestion(
      this.assessmentId,
      updatedQuestion
    );

    this.questionSaved.emit();
  }

  onConditionalRuleChange(): void {
    if (this.currentQuestion) {
      this.save();
    }
  }
}

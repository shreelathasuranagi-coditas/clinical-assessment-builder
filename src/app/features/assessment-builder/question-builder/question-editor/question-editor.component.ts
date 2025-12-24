import { Component, inject, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { Question, QuestionType } from '../../../../core/models/assessment.model';
import { ConditionRuleEditor } from '../condition-rule-editor/condition-rule-editor';

@Component({
  selector: 'app-question-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    ConditionRuleEditor,
  ],
  templateUrl: './question-editor.component.html',
  styleUrl: './question-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionEditorComponent implements OnInit {
  assessmentService = inject(AssessmentService);

  @Input() assessmentId: string = '';
  @Input() questionId: string = '';
  @Output() questionSaved = new EventEmitter<void>();

  questionTypes: QuestionType[] = ['single_choice', 'multi_choice', 'short_text'];

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

  private loadQuestion(): void {
    const assessment = this.assessmentService.getAssessment(this.assessmentId);
    const question = assessment?.questions.find(q => q.id === this.questionId);

    if (question) {
      this.currentQuestion = question;
      this.form.patchValue({
        text: question.text,
        type: question.type,
        required: question.required,
      });

      const optionsArray = this.form.get('options') as FormArray;
      optionsArray.clear();

      question.options.forEach(option => {
        optionsArray.push(
          new FormGroup({
            id: new FormControl(option.id),
            text: new FormControl(option.text, Validators.required),
          })
        );
      });

      this.updateOptionsVisibility();
    }
  }

  get optionsArray(): FormArray {
    return this.form.get('options') as FormArray;
  }

  get typeValue(): QuestionType {
    return this.form.get('type')?.value || 'single_choice';
  }

  get isChoiceType(): boolean {
    const type = this.typeValue;
    return type === 'single_choice' || type === 'multi_choice';
  }

  addOption(): void {
    const optionsArray = this.form.get('options') as FormArray;
    optionsArray.push(
      new FormGroup({
        id: new FormControl(Date.now().toString()),
        text: new FormControl('', Validators.required),
      })
    );
  }

  removeOption(index: number): void {
    const optionsArray = this.form.get('options') as FormArray;
    optionsArray.removeAt(index);
  }

  onTypeChange(): void {
    this.updateOptionsVisibility();
    if (!this.isChoiceType) {
      const optionsArray = this.form.get('options') as FormArray;
      optionsArray.clear();
    }
  }

  private updateOptionsVisibility(): void {
    const optionsArray = this.form.get('options') as FormArray;
    if (!this.isChoiceType && optionsArray.length === 0) {
      optionsArray.disable();
    } else if (this.isChoiceType) {
      optionsArray.enable();
    }
  }

  save(): void {
    if (!this.form.valid || !this.isChoiceType) {
      // Allow saving if form is valid
    }

    if (!this.currentQuestion) return;

    const optionsArray = this.form.get('options') as FormArray;
    const options = this.isChoiceType
      ? optionsArray.getRawValue().map((opt: any) => ({
          id: opt.id,
          text: opt.text,
        }))
      : [];

    const updatedQuestion: Question = {
      ...this.currentQuestion,
      text: this.form.get('text')?.value || '',
      type: this.form.get('type')?.value as QuestionType,
      required: this.form.get('required')?.value || false,
      options,
    };

    this.assessmentService.updateQuestion(this.assessmentId, updatedQuestion);
    this.questionSaved.emit();
  }

  onConditionalRuleChange(): void {
    // This will be called from the condition rule editor
    if (this.currentQuestion) {
      this.save();
    }
  }
}

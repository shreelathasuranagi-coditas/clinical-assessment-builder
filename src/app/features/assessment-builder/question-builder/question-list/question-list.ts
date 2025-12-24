import { Component, inject, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { Question } from '../../../../core/models/assessment.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    DragDropModule,
  ],
  templateUrl: './question-list.html',
  styleUrl: './question-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionList {
  assessmentService = inject(AssessmentService);

  @Input() assessmentId: string = '';
  @Output() questionSelected = new EventEmitter<string>();
  @Output() questionDeleted = new EventEmitter<void>();

  selectedQuestionId = signal<string | null>(null);

  get assessment() {
    return this.assessmentService.currentAssessment();
  }

  get questions(): Question[] {
    const assessment = this.assessment;
    if (assessment) {
      return [...assessment.questions].sort((a, b) => a.order - b.order);
    }
    return [];
  }

  selectQuestion(question: Question): void {
    this.selectedQuestionId.set(question.id);
    this.questionSelected.emit(question.id);
  }

  addQuestion(): void {
    if (!this.assessmentId) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'single_choice',
      required: false,
      options: [],
      conditional: null,
      order: this.questions.length,
    };

    this.assessmentService.addQuestion(this.assessmentId, newQuestion);
    this.selectQuestion(newQuestion);
  }

  deleteQuestion(question: Question, event: Event): void {
    event.stopPropagation();

    if (confirm(`Delete question: "${question.text}"?`)) {
      this.assessmentService.deleteQuestion(this.assessmentId, question.id);
      this.questionDeleted.emit();
    }
  }

  moveUp(question: Question, event: Event): void {
    event.stopPropagation();

    const questions = this.questions;
    const index = questions.findIndex(q => q.id === question.id);

    if (index > 0) {
      const reordered = [...questions];
      [reordered[index], reordered[index - 1]] = [
        reordered[index - 1],
        reordered[index],
      ];
      this.assessmentService.reorderQuestions(this.assessmentId, reordered);
    }
  }

  moveDown(question: Question, event: Event): void {
    event.stopPropagation();

    const questions = this.questions;
    const index = questions.findIndex(q => q.id === question.id);

    if (index < questions.length - 1) {
      const reordered = [...questions];
      [reordered[index], reordered[index + 1]] = [
        reordered[index + 1],
        reordered[index],
      ];
      this.assessmentService.reorderQuestions(this.assessmentId, reordered);
    }
  }

  getQuestionPreview(question: Question): string {
    if (question.text.length > 40) {
      return question.text.substring(0, 40) + '...';
    }
    return question.text || 'Untitled Question';
  }
}

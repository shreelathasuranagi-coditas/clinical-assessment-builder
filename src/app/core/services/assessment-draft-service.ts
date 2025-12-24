import { Injectable, signal } from '@angular/core';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentDraftService {
  private draft = signal<Assessment | null>(null);

  setDraft(assessment: Assessment) {
    this.draft.set(assessment);
  }

  getDraft() {
    return this.draft();
  }

  clearDraft() {
    this.draft.set(null);
  }

  addQuestion(question: Question) {
    if (!this.draft()) return;

    this.draft.update((a) => ({
      ...a!,
      questions: [...(a!.questions || []), question],
    }));
  }

  updateQuestion(updated: Question) {
    if (!this.draft()) return;

    this.draft.update((a) => ({
      ...a!,
      questions: a!.questions!.map((q) =>
        q.question_id === updated.question_id ? updated : q
      ),
    }));
  }

  removeQuestion(questionId: number) {
    if (!this.draft()) return;

    this.draft.update((a) => ({
      ...a!,
      questions: a!.questions!.filter((q) => q.question_id !== questionId),
    }));
  }
}

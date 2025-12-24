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

  getDraft(): Assessment | null {
    return this.draft();
  }

  clearDraft() {
    this.draft.set(null);
  }

  addQuestion(question: Question) {
    const current = this.draft();
    if (!current) return;

    this.draft.set({
      ...current,
      questions: [...(current.questions ?? []), question],
    });
  }

  updateQuestion(updated: Question) {
    const current = this.draft();
    if (!current || !current.questions) return;

    this.draft.set({
      ...current,
      questions: current.questions.map((q) =>
        q.id === updated.id ? updated : q
      ),
    });
  }

  removeQuestion(questionId: string) {
    const current = this.draft();
    if (!current || !current.questions) return;

    this.draft.set({
      ...current,
      questions: current.questions.filter((q) => q.id !== questionId),
    });
  }
}

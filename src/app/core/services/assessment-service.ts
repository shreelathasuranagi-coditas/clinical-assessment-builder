import { Injectable, signal } from '@angular/core';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  // State
  assessments = signal<Assessment[]>([]);
  currentAssessment = signal<Assessment | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  // ------------------------
  // Storage helpers
  // ------------------------
  private loadFromStorage(): void {
    const stored = localStorage.getItem('assessments');
    if (!stored) return;

    try {
      this.assessments.set(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse assessments from storage', e);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(
      'assessments',
      JSON.stringify(this.assessments())
    );
  }

  // ------------------------
  // Queries
  // ------------------------
  getAll(): Assessment[] {
    return this.assessments();
  }

  getById(assessmentId: string): Assessment | undefined {
    return this.assessments().find(
      (a) => a.assessment_id === assessmentId
    );
  }

  // ------------------------
  // Assessment CRUD
  // ------------------------
  createAssessment(payload: {
    name: string;
    category_id: number;
    description: string;
  }): Assessment {
    const now = new Date().toISOString();

    const assessment: Assessment = {
      assessment_id: crypto.randomUUID(),
      name: payload.name,
      category_id: payload.category_id,
      description: payload.description,
      status: 'DRAFT',
      created_by: Number(localStorage.getItem('userId')) || 0,
      created_at: now,
      updated_at: now,
      questions: [],
    };

    this.assessments.set([...this.assessments(), assessment]);
    this.saveToStorage();

    return assessment;
  }

  updateAssessment(
    assessmentId: string,
    changes: Partial<Pick<Assessment, 'name' | 'category_id' | 'description' | 'status'>>
  ): void {
    const updated = this.assessments().map((a) =>
      a.assessment_id === assessmentId
        ? {
            ...a,
            ...changes,
            updated_at: new Date().toISOString(),
          }
        : a
    );

    this.assessments.set(updated);
    this.saveToStorage();

    if (this.currentAssessment()?.assessment_id === assessmentId) {
      this.currentAssessment.set(
        updated.find((a) => a.assessment_id === assessmentId) || null
      );
    }
  }

  deleteAssessment(assessmentId: string): void {
    this.assessments.set(
      this.assessments().filter(
        (a) => a.assessment_id !== assessmentId
      )
    );

    if (this.currentAssessment()?.assessment_id === assessmentId) {
      this.currentAssessment.set(null);
    }

    this.saveToStorage();
  }

  // ------------------------
  // Questions
  // ------------------------
  addQuestion(assessmentId: string, question: Question): void {
    this.updateQuestions(assessmentId, (questions) => {
      const maxOrder = Math.max(
        -1,
        ...questions.map((q) => q.order)
      );

      return [...questions, { ...question, order: maxOrder + 1 }];
    });
  }

  updateQuestion(assessmentId: string, question: Question): void {
    this.updateQuestions(assessmentId, (questions) =>
      questions.map((q) => (q.id === question.id ? question : q))
    );
  }

  deleteQuestion(assessmentId: string, questionId: string): void {
    this.updateQuestions(assessmentId, (questions) =>
      questions
        .filter((q) => q.id !== questionId)
        .map((q) => ({
          ...q,
          conditional:
            q.conditional?.questionId === questionId
              ? null
              : q.conditional,
        }))
    );
  }

  reorderQuestions(assessmentId: string, questions: Question[]): void {
    this.updateQuestions(assessmentId, () =>
      questions.map((q, i) => ({ ...q, order: i }))
    );
  }

  private updateQuestions(
    assessmentId: string,
    updater: (questions: Question[]) => Question[]
  ) {
    const updated = this.assessments().map((a) => {
      if (a.assessment_id !== assessmentId) return a;

      return {
        ...a,
        questions: updater(a.questions ?? []),
        updated_at: new Date().toISOString(),
      };
    });

    this.assessments.set(updated);
    this.saveToStorage();

    if (this.currentAssessment()?.assessment_id === assessmentId) {
      this.currentAssessment.set(
        updated.find((a) => a.assessment_id === assessmentId) || null
      );
    }
  }

  // ------------------------
  // Current assessment
  // ------------------------
  setCurrentAssessment(assessmentId: string): void {
    const assessment = this.getById(assessmentId);
    if (assessment) {
      this.currentAssessment.set(assessment);
    }
  }

  clearCurrentAssessment(): void {
    this.currentAssessment.set(null);
  }
}

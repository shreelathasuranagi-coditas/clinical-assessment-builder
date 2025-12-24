import { Injectable, inject, signal, computed } from '@angular/core';
import { Assessment, Question, AssessmentMetadata } from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  // Signals for state management
  assessments = signal<Assessment[]>([
    {
      id: '1',
      name: 'Sample Assessment',
      category: 'Hereditary Cancer',
      description: 'Initial screening form',
      status: 'Draft',
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  currentAssessment = signal<Assessment | null>(null);

  // Initialize assessments from localStorage
  constructor() {
    this.loadAssessmentsFromStorage();
  }

  // Load assessments from localStorage
  private loadAssessmentsFromStorage(): void {
    const stored = localStorage.getItem('assessments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const assessmentsData = parsed.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        }));
        this.assessments.set(assessmentsData);
      } catch (e) {
        console.error('Failed to parse assessments from localStorage:', e);
      }
    }
  }

  // Save assessments to localStorage
  private saveAssessmentsToStorage(): void {
    localStorage.setItem('assessments', JSON.stringify(this.assessments()));
  }

  // Get all assessments
  getAllAssessments() {
    return this.assessments();
  }

  // Get assessment by ID
  getAssessment(id: string): Assessment | undefined {
    return this.assessments().find(a => a.id === id);
  }

  // Create new assessment
  createAssessment(metadata: AssessmentMetadata): Assessment {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      name: metadata.name,
      category: metadata.category,
      description: metadata.description,
      status: 'Draft',
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...this.assessments(), newAssessment];
    this.assessments.set(updated);
    this.saveAssessmentsToStorage();
    return newAssessment;
  }

  // Update assessment metadata
  updateAssessmentMetadata(id: string, metadata: AssessmentMetadata): void {
    const assessments = this.assessments();
    const index = assessments.findIndex(a => a.id === id);

    if (index !== -1) {
      const updated = [...assessments];
      updated[index] = {
        ...updated[index],
        name: metadata.name,
        category: metadata.category,
        description: metadata.description,
        updatedAt: new Date(),
      };
      this.assessments.set(updated);
      this.saveAssessmentsToStorage();

      if (this.currentAssessment()?.id === id) {
        this.currentAssessment.set(updated[index]);
      }
    }
  }

  // Add question to assessment
  addQuestion(assessmentId: string, question: Question): void {
    const assessments = this.assessments();
    const index = assessments.findIndex(a => a.id === assessmentId);

    if (index !== -1) {
      const updated = [...assessments];
      const maxOrder = Math.max(
        ...updated[index].questions.map(q => q.order),
        -1
      );
      const newQuestion: Question = {
        ...question,
        order: maxOrder + 1,
      };
      updated[index].questions.push(newQuestion);
      updated[index].updatedAt = new Date();

      this.assessments.set(updated);
      this.saveAssessmentsToStorage();

      if (this.currentAssessment()?.id === assessmentId) {
        this.currentAssessment.set(updated[index]);
      }
    }
  }

  // Update question
  updateQuestion(assessmentId: string, question: Question): void {
    const assessments = this.assessments();
    const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);

    if (assessmentIndex !== -1) {
      const updated = [...assessments];
      const questionIndex = updated[assessmentIndex].questions.findIndex(
        q => q.id === question.id
      );

      if (questionIndex !== -1) {
        updated[assessmentIndex].questions[questionIndex] = question;
        updated[assessmentIndex].updatedAt = new Date();

        this.assessments.set(updated);
        this.saveAssessmentsToStorage();

        if (this.currentAssessment()?.id === assessmentId) {
          this.currentAssessment.set(updated[assessmentIndex]);
        }
      }
    }
  }

  // Delete question
  deleteQuestion(assessmentId: string, questionId: string): void {
    const assessments = this.assessments();
    const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);

    if (assessmentIndex !== -1) {
      const updated = [...assessments];
      const filteredQuestions = updated[assessmentIndex].questions.filter(
        q => q.id !== questionId
      );

      // Clear conditional rules that reference the deleted question
      const clearedQuestions = filteredQuestions.map(q => ({
        ...q,
        conditional:
          q.conditional?.questionId === questionId ? null : q.conditional,
      }));

      updated[assessmentIndex].questions = clearedQuestions;
      updated[assessmentIndex].updatedAt = new Date();

      this.assessments.set(updated);
      this.saveAssessmentsToStorage();

      if (this.currentAssessment()?.id === assessmentId) {
        this.currentAssessment.set(updated[assessmentIndex]);
      }
    }
  }

  // Reorder questions
  reorderQuestions(assessmentId: string, questions: Question[]): void {
    const assessments = this.assessments();
    const index = assessments.findIndex(a => a.id === assessmentId);

    if (index !== -1) {
      const updated = [...assessments];
      const reorderedQuestions = questions.map((q, i) => ({
        ...q,
        order: i,
      }));
      updated[index].questions = reorderedQuestions;
      updated[index].updatedAt = new Date();

      this.assessments.set(updated);
      this.saveAssessmentsToStorage();

      if (this.currentAssessment()?.id === assessmentId) {
        this.currentAssessment.set(updated[index]);
      }
    }
  }

  // Set current assessment
  setCurrentAssessment(id: string): void {
    const assessment = this.getAssessment(id);
    if (assessment) {
      this.currentAssessment.set(assessment);
    }
  }

  // Clear current assessment
  clearCurrentAssessment(): void {
    this.currentAssessment.set(null);
  }

  // Save assessment (auto-save draft)
  saveAssessment(): void {
    if (this.currentAssessment()) {
      this.saveAssessmentsToStorage();
    }
  }

  // Delete assessment
  deleteAssessment(id: string): void {
    const updated = this.assessments().filter(a => a.id !== id);
    this.assessments.set(updated);
    this.saveAssessmentsToStorage();

    if (this.currentAssessment()?.id === id) {
      this.clearCurrentAssessment();
    }
  }
}

export type QuestionType = 'single_choice' | 'multi_choice' | 'short_text';

export interface ConditionalRule {
  questionId: string;
  value: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options: QuestionOption[]; // For choice questions
  conditional: ConditionalRule | null;
  order: number;
}

export interface Assessment {
  id: string;
  name: string;
  category: 'Oncology' | 'Hereditary Cancer' | 'Reproductive Health' | 'Other';
  description: string;
  status: 'Draft' | 'Published';
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentMetadata {
  name: string;
  category: 'Oncology' | 'Hereditary Cancer' | 'Reproductive Health' | 'Other';
  description: string;
}

export type QuestionType =
  | 'single_choice'
  | 'multi_choice'
  | 'short_text'
  | 'number'
  | 'date';

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
  options: QuestionOption[];       
  conditional: ConditionalRule | null;
  order: number;
}

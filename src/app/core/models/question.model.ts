export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TEXT'
  | 'NUMBER'
  | 'DATE';

export interface Question {
  question_id: number;
  assessment_id: string;
  question_text: string;
  question_type: QuestionType;
  is_required: boolean;
  question_order: number;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
}

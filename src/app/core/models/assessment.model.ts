import { Question } from './question.model';

export type AssessmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Assessment {
  assessment_id: string;
  name: string;
  category_id: number;
  description: string;
  status: AssessmentStatus;
  created_by: number;
  created_at: string;
  updated_at: string;

  questions?: Question[];
}

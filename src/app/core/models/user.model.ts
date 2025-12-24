export interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CLINICIAN';
  hospital_id: number;
  created_at: string;
  updated_at: string;
}

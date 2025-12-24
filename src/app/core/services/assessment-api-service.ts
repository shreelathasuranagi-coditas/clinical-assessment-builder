import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Assessment } from '../models/assessment.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.mockDbUrl;

  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments`);
  }

  getAssessmentById(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/assessments/${id}`);
  }

  createAssessment(payload: Assessment): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments`, payload);
  }

  updateAssessment(id: string, payload: Partial<Assessment>): Observable<Assessment> {
    return this.http.patch<Assessment>(
      `${this.baseUrl}/assessments/${id}`,
      payload
    );
  }

  deleteAssessment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/assessments/${id}`);
  }
}

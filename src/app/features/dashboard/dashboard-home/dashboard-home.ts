import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AssessmentService } from '../../../core/services/assessment-service';
import { Button } from '../../../shared/components/button/button';
import { Assessment } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    Button,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHome {
  private assessmentService = inject(AssessmentService);
  private router = inject(Router);

  assessments = this.assessmentService.assessments;

  // Statistics
  totalAssessments = computed(() => this.assessments().length);
  
  draftAssessments = computed(() =>
    this.assessments().filter(a => a.status === 'DRAFT').length
  );
  
  publishedAssessments = computed(() =>
    this.assessments().filter(a => a.status === 'PUBLISHED').length
  );

  // Recently created assessments (sorted by created_at, limit to 5)
  recentAssessments = computed(() => {
    return [...this.assessments()]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  });

  categoryMap: Record<number, string> = {
    1: 'Oncology',
    2: 'Hereditary Cancer',
    3: 'Reproductive Health',
    4: 'Other',
  };

  viewAllAssessments(): void {
    this.router.navigate(['/dashboard/assessment-list']);
  }

  editAssessment(assessmentId: string): void {
    this.router.navigate(['/assessment', assessmentId, 'details']);
  }

  previewAssessment(assessmentId: string): void {
    this.router.navigate(['/assessment', assessmentId, 'preview']);
  }

  getStatusBadgeClass(status: string): string {
    return {
      'DRAFT': 'badge-draft',
      'PUBLISHED': 'badge-published',
      'ARCHIVED': 'badge-archived',
    }[status] || '';
  }
}

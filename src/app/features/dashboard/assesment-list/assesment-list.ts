import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentService } from '../../../core/services/assessment-service';
import { CreateAssessment } from '../create-assessment/create-assessment';
import { Assessment } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-assesment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CreateAssessment,
  ],
  templateUrl: './assesment-list.html',
  styleUrl: './assesment-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssesmentList {
  private assessmentService = inject(AssessmentService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  assessments = this.assessmentService.assessments;

  displayedColumns: (keyof Assessment | 'actions')[] = [
    'name',
    'category_id',
    'status',
    'updated_at',
    'actions',
  ];

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateAssessment, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const assessment = this.assessmentService.createAssessment(result);

      this.router.navigate([
        '/assessment',
        assessment.assessment_id,
        'details',
      ]);
    });
  }

  editAssessment(assessmentId: string): void {
    this.router.navigate(['/assessment', assessmentId, 'details']);
  }

  deleteAssessment(assessmentId: string): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.assessmentService.deleteAssessment(assessmentId);
    }
  }

  previewAssessment(assessmentId: string): void {
    this.router.navigate(['/assessment', assessmentId, 'preview']);
  }
}

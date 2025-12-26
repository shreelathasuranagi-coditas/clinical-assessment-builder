import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AssessmentService } from '../../../core/services/assessment-service';
import { Assessment } from '../../../core/models/assessment.model';
import { ConfirmationModal } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { CreateAssessment } from '../create-assessment/create-assessment';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-assesment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    Button,
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

  categoryMap: Record<number, string> = {
    1: 'Oncology',
    2: 'Hereditary Cancer',
    3: 'Reproductive Health',
    4: 'Other',
  };

  // ---------------------------
  // Create (DIALOG — SAME AS SIDENAV)
  // ---------------------------
  createAssessment(): void {
    this.dialog
      .open(CreateAssessment, {
        width: '500px',
        disableClose: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const assessment =
            this.assessmentService.createAssessment(result);

          this.router.navigate([
            '/assessment',
            assessment.assessment_id,
            'details',
          ]);
        }
      });
  }

  editAssessment(assessmentId: string): void {
    this.router.navigate([
      '/assessment',
      assessmentId,
      'details',
    ]);
  }

  previewAssessment(assessmentId: string): void {
    this.router.navigate([
      '/assessment',
      assessmentId,
      'preview',
    ]);
  }

  deleteAssessment(assessmentId: string): void {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      width: '400px',
      data: {
        title: 'Delete Assessment',
        message:
          'Are you sure you want to delete this assessment? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.assessmentService.deleteAssessment(assessmentId);
      }
    });
  }
}

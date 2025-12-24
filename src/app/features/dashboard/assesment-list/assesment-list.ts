import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentService } from '../../../core/services/assessment-service';
import { CreateAssessmentDialogComponent } from '../create-assessment-dialog/create-assessment-dialog.component';

@Component({
  selector: 'app-assesment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, CreateAssessmentDialogComponent],
  templateUrl: './assesment-list.html',
  styleUrl: './assesment-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssesmentList {
  assessmentService = inject(AssessmentService);
  router = inject(Router);
  dialog = inject(MatDialog);

  assessments = this.assessmentService.assessments;
  displayedColumns = ['name', 'category', 'status', 'updatedAt', 'actions'];

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateAssessmentDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const assessment = this.assessmentService.createAssessment(result);
        this.router.navigate(['/assessment', assessment.id, 'details']);
      }
    });
  }

  editAssessment(id: string): void {
    this.router.navigate(['/assessment', id, 'details']);
  }

  deleteAssessment(id: string): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.assessmentService.deleteAssessment(id);
    }
  }

  previewAssessment(id: string): void {
    this.router.navigate(['/assessment', id, 'preview']);
  }
}
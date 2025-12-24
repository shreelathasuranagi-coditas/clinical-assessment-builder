import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AssessmentService } from '../../../core/services/assessment-service';
import { QuestionList } from './question-list/question-list';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { Question } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-question-builder',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    QuestionList,
    QuestionEditorComponent,
  ],
  templateUrl: './question-builder.component.html',
  styleUrl: './question-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionBuilderComponent implements OnInit {
  assessmentService = inject(AssessmentService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  assessment = this.assessmentService.currentAssessment;
  selectedQuestionId: string | null = null;

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (assessmentId) {
      const assessment = this.assessmentService.getAssessment(assessmentId);
      if (assessment) {
        this.assessmentService.setCurrentAssessment(assessmentId);
      }
    }
  }

  onQuestionSelected(questionId: string): void {
    this.selectedQuestionId = questionId;
  }

  onQuestionSaved(): void {
    this.selectedQuestionId = null;
  }

  onQuestionDeleted(): void {
    this.selectedQuestionId = null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  preview(): void {
    if (this.assessment()) {
      this.router.navigate(['/assessment', this.assessment()!.id, 'preview']);
    }
  }
}

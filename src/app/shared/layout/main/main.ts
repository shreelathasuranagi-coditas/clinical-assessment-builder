import { Component, viewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Header } from '../header/header';
import { Sidenav } from '../../components/sidenav/sidenav';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { CreateAssessment } from '../../../features/dashboard/create-assessment/create-assessment';
import { AssessmentService } from '../../../core/services/assessment-service';

@Component({
  selector: 'app-main',
  imports: [Header,Sidenav,RouterOutlet,Footer],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private assessmentService = inject(AssessmentService);
  sidenav = viewChild(Sidenav);

  toggleSidebar() {
    this.sidenav()?.toggle();
  }

  onCreateAssessment(): void {
    this.dialog.open(CreateAssessment, {
      width: '500px',
      disableClose: false,
    }).afterClosed().subscribe((result) => {
      if (result) {
        const assessment = this.assessmentService.createAssessment(result);
        this.router.navigate(['/assessment', assessment.assessment_id, 'details']);
      }
    });
  }
}

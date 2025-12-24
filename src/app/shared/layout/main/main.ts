import { Component, viewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Toolbar } from '../../components/toolbar/toolbar';
import { Button } from '../../components/button/button';
import { Header } from '../header/header';
import { Sidenav } from '../../components/sidenav/sidenav';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { CreateAssessment } from '../../../features/dashboard/create-assessment/create-assessment';

@Component({
  selector: 'app-main',
  imports: [Toolbar,Button,Header,Sidenav,RouterOutlet,Footer],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  private router = inject(Router);
  private dialog = inject(MatDialog);
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
        // The dialog handles navigation after creation
      }
    });
  }
}

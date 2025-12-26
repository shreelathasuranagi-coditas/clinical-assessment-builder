import { Component, ViewChild, output } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Button } from '../button/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule,MatListModule,Button,MatButtonModule,MatIconModule,RouterModule, RouterOutlet],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
    @ViewChild(MatSidenav)
  private sidenav!: MatSidenav;

  createAssessment = output<void>();

  toggle() {
    this.sidenav.toggle();
  }

  onNavItemClick() {
    this.sidenav.close();
  }
}

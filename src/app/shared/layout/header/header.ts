import { Component, output } from '@angular/core';
import { Button } from '../../components/button/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Toolbar } from '../../components/toolbar/toolbar';

@Component({
  selector: 'app-header',
  imports: [Button,MatToolbarModule,MatIconModule,Toolbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
 toggleSidebar = output<void>();
  
  createAssessment = output<void>();
}

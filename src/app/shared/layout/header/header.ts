import { Component, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Toolbar } from '../../components/toolbar/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule,MatIconModule,Toolbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
 toggleSidebar = output<void>();
}

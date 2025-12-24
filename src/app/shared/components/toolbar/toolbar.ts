import { Component, input, output } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { Button } from '../button/button';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule,MatIconModule,Button],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
   title = input<string>('');
  showMenu = input<boolean>(false);
  showAction = input<boolean>(false);

  actionLabel = input<string>('Action');

  menuClick = output<void>();
  actionClick = output<void>();
}

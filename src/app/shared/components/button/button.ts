import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
    primary = input<boolean>(false);
  secondary = input<boolean>(false);
  disabled = input<boolean>(false);
}

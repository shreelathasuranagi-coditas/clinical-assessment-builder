import { Component, input, output, signal } from '@angular/core';
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
  loading = signal<boolean>(false);
  type = input<'button' | 'submit'>('button');
  color = input<'primary' | 'accent' | 'warn'>('primary');
  clicked = output<void>();
}

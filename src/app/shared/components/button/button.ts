import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
    primary = input<boolean>(false);
  secondary = input<boolean>(false);
  disabled = input<boolean>(false);
}

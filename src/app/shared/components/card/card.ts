import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { InputRenderer } from '../../form-controls/input-renderer/input-renderer';

@Component({
  selector: 'app-card',
  imports: [MatCardModule,InputRenderer],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  question = input.required<any>();
  sectionLabel = input<string>('');

  answerChange = output<{
    question: string;
    answer: string 
  }>();

  onAnswerChange(value: any) {
    const answer =
      Array.isArray(value) ? value.join(', ') : String(value ?? '');

    this.answerChange.emit({
      question: this.question().question,
      answer,
    });
  }
}

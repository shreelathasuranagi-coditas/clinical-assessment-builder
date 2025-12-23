import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'app-input-renderer',
  imports: [MatFormFieldModule,MatRadioButton,MatCheckbox,MatInputModule,MatRadioGroup],
  templateUrl: './input-renderer.html',
  styleUrl: './input-renderer.scss',
})
export class InputRenderer {
   // input signal
  question = input.required<any>();

  // local answer state (signal)
  answer = signal<any | null>(null);

  // output signal
  answerChange = output<any | null>();

  // private storage = inject(StorageService);

  // constructor() {
  //   // hydrate from storage when the question changes
  //   effect(() => {
  //     const q = this.question();
  //     const stored = this.storage.getAnswer(q.question);
  //     this.answer.set(stored ?? null);
  //   });
  // }

  // // TEXT / NUMBER
  // onTextChange(value: string | number) {
  //   this.answer.set(value);
  //   this.answerChange.emit(this.answer());
  //   this.storage.saveAnswer(this.question().question, value);
  // }

  // RADIO
  onRadioChange(value: string) {
    this.answer.set(value);
    this.answerChange.emit(this.answer());
    // this.storage.saveAnswer(this.question().question, value);
  }

  // CHECKBOX
  onCheckboxChange(option: string, checked: boolean) {
    const current = (this.answer() as string[]) ?? [];

    const updated = checked
      ? [...current, option]
      : current.filter(v => v !== option);

    this.answer.set(updated);
    this.answerChange.emit(this.answer());
    // this.storage.saveAnswer(this.question().question, updated);
  }

  isChecked(option: string): boolean {
    const value = this.answer();
    return Array.isArray(value) && value.indexOf(option) > -1;
  }

}

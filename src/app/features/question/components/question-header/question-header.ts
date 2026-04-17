import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-header',
  imports: [],
  templateUrl: './question-header.html',
  styleUrl: './question-header.scss',
})
export class QuestionHeader {
  @Input() timePointLabel: string = '';
  @Output() cancel = new EventEmitter<void>();

  onCancelClick() {
    const confirmed = confirm(
      'Вы уверены, что хотите отменить заполнение опросника? Все данные будут потеряны.',
    );

    if (confirmed) {
      this.cancel.emit();
      console.log('Опросник отменён');
    }
  }
}

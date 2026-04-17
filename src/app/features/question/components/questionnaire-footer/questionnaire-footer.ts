import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-questionnaire-footer',
  imports: [],
  templateUrl: './questionnaire-footer.html',
  styleUrl: './questionnaire-footer.scss',
})
export class QuestionnaireFooter {
  // Сколько вопросов уже заполнено
  @Input() currentProgress: number = 0;

  // Итоговый балл (0-50)
  @Input() totalScore: number = 0;

  // Флаг: можно ли нажимать кнопку (все ли 11 ответов есть)
  @Input() isValid: boolean = false;

  // Событие нажатия на кнопку "Отправить"
  @Output() submitForm = new EventEmitter<void>();

  onSubmit() {
    if (this.isValid) {
      this.submitForm.emit();
    }
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-satisfaction-card',
  imports: [],
  templateUrl: './satisfaction-card.html',
  styleUrl: './satisfaction-card.scss',
})
export class SatisfactionCard {
  @Input() selectedSatisfaction: number | undefined;

  // Отправляем ID выбранного варианта наверх в QuestionDashboard
  @Output() satisfactionSelected = new EventEmitter<number>();

  select(value: number) {
    this.satisfactionSelected.emit(value);
  }
}

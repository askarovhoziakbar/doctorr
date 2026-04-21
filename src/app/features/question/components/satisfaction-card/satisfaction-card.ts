import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-satisfaction-card',
  imports: [],
  templateUrl: './satisfaction-card.html',
  styleUrl: './satisfaction-card.scss',
})
export class SatisfactionCard {
  @Input() selectedSatisfaction: number | undefined;

  @Output() satisfactionSelected = new EventEmitter<number>();

  select(value: number) {
    this.selectedSatisfaction = value; // Мгновенно подсвечиваем кнопку
    this.satisfactionSelected.emit(value); // Отправляем родителю
  }
}

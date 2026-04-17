import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-card',
  imports: [CommonModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
})
export class QuestionCard {
  @Input() question: any; // Сам вопрос {id, text}
  @Input() scoreLabels: string[] = []; // Подписи к баллам
  @Input() selectedScore: number | null = null; // Выбранный балл (если есть)

  @Output() answerSelected = new EventEmitter<number>();

  setScore(score: number) {
    this.answerSelected.emit(score);
  }
}

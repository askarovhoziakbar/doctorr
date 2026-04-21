import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questionnaire-details',
  imports: [CommonModule],
  templateUrl: './questionnaire-details.html',
  styleUrl: './questionnaire-details.scss',
})
export class QuestionnaireDetails {
  @Input() data: any;
  @Input() questions: any[] = [];
  @Output() close = new EventEmitter<void>();

  getTimePointLabel(timePoint: number): string {
    const labels: any = { 0: 'Первый визит', 3: '3 месяца', 6: '6 месяцев', 12: '12 месяцев' };
    return labels[timePoint] || timePoint;
  }

  getScoreBadge(score: number): string {
    if (score <= 10) return 'badge-success';
    if (score <= 20 || score <= 35) return 'badge-warning';
    return 'badge-danger';
  }

  getScoreLabel(score: number): string {
    const labels: any = {
      0: 'нет симптома',
      1: 'симптом есть, но не беспокоит',
      2: 'симптом иногда беспокоит',
      3: 'симптом часто беспокоит',
      4: 'симптом беспокоит постоянно',
      5: 'симптом мешает повседневной деятельности',
    };
    return labels[score] || '';
  }

  getSatisfactionLabel(value: number | string): string {
    const labels: any = {
      0: 'Удовлетворен',
      1: 'Да и нет',
      2: 'Не удовлетворен',
    };
    // Используем Number(value), на случай если из базы пришла строка
    return labels[Number(value)] || 'Не указано';
  }
}

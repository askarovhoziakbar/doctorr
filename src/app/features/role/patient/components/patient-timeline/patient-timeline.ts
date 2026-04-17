import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-timeline',
  imports: [CommonModule],
  templateUrl: './patient-timeline.html',
  styleUrl: './patient-timeline.scss',
})
export class PatientTimeline {
  @Input() registrationDate!: string; // Дата регистрации пациента
  @Input() questionnaires: any[] = []; // Все заполненные опросники

  @Output() fill = new EventEmitter<number>();
  @Output() view = new EventEmitter<string>();

  timelineItems: any[] = [];

  ngOnInit() {
    this.generateTimeline();
  }

  generateTimeline() {
    const regDate = new Date(this.registrationDate);
    const today = new Date();
    // Сбрасываем время для чистого сравнения дат (как в твоем JS: .setHours(0,0,0,0))
    today.setHours(0, 0, 0, 0);

    const timePoints = [
      { label: 'Первый визит', months: 0, tp: 0 },
      { label: '3 месяца', months: 3, tp: 3 },
      { label: '6 месяцев', months: 6, tp: 6 },
      { label: '12 месяцев', months: 12, tp: 12 },
    ];

    this.timelineItems = timePoints.map((tp) => {
      const dueDate = new Date(regDate);
      dueDate.setMonth(dueDate.getMonth() + tp.months);
      dueDate.setHours(0, 0, 0, 0);

      // Ищем опросник
      const report = this.questionnaires.find(
        (q) => q.timePoint === tp.tp || q.time_point === tp.tp,
      );

      // Считаем разницу в днях (из твоего JS)
      const diffTime = dueDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status: 'complete' | 'overdue' | 'pending';
      let statusText = '';
      let canFill = false;

      if (report) {
        status = 'complete';
        statusText = 'Заполнен';
      } else if (today >= dueDate) {
        // Если даты нет в базе и сегодня >= срока — это просрочено
        status = 'overdue';
        statusText = 'Просрочен';
        canFill = true; // Можно заполнить прямо сейчас
      } else {
        status = 'pending';
        // Если до срока <= 7 дней
        if (daysUntil <= 7) {
          canFill = true;
          statusText = 'Доступен для заполнения';
        } else {
          statusText = `Доступ откроется через ${daysUntil} дн.`;
        }
      }

      return {
        ...tp,
        dueDate,
        report,
        status,
        statusText,
        canFill,
        daysUntil,
      };
    });
  }

  // Твоя функция цвета бейджа
  getScoreBadge(score: number) {
    if (score <= 10) return 'badge-success';
    if (score <= 20) return 'badge-warning';
    return 'badge-danger';
  }
  getScoreDescription(score: number): string {
    if (score <= 10) return 'Отличный результат';
    if (score <= 25) return 'Удовлетворительно';
    return 'Требуется внимание врача';
  }
  fillNow(tp: number) {
    this.fill.emit(tp);
  }

  viewDetail(id: string) {
    this.view.emit(id);
  }

  getCompletedCount(): number {
    return this.timelineItems.filter((item) => item.status === 'complete').length;
  }

  getOverdueCount(): number {
    return this.timelineItems.filter((item) => item.status === 'overdue').length;
  }
}

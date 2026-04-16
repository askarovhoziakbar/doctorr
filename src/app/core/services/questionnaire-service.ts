import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  // 1. Централизованный конфиг таймлайна
  readonly TIMELINE_CONFIG = [
    { label: 'Первый визит', months: 0, tp: 0 },
    { label: '3 месяца', months: 3, tp: 3 },
    { label: '6 месяцев', months: 6, tp: 6 },
    { label: '12 месяцев', months: 12, tp: 12 },
  ];

  // 2. Логика раскраски баллов
  getScoreSeverity(score: number): 'excellent' | 'warning' | 'danger' {
    if (score <= 10) return 'excellent';
    if (score <= 25) return 'warning';
    return 'danger';
  }

  // 3. Подсчет даты дедлайна
  calculateDueDate(registrationDate: Date, monthsToAdd: number): Date {
    const dueDate = new Date(registrationDate);
    dueDate.setMonth(dueDate.getMonth() + monthsToAdd);
    return dueDate;
  }

  // 4. Подсчет оставшихся дней
  getDaysUntil(dueDate: Date): number {
    const today = new Date();
    const diffMs = dueDate.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}

import { Component, inject } from '@angular/core';
import { QuestionHeader } from '../components/question-header/question-header';
import { QuestionnaireService } from '../../../core/services/questionnaire-service';
import { Router } from '@angular/router';
import { QuestionCard } from '../components/question-card/question-card';
import { CommonModule } from '@angular/common';
import { QuestionnaireFooter } from '../components/questionnaire-footer/questionnaire-footer';
import { SatisfactionCard } from '../components/satisfaction-card/satisfaction-card';

@Component({
  selector: 'app-question-dashboard',
  imports: [QuestionHeader, QuestionCard, CommonModule, QuestionnaireFooter, SatisfactionCard],
  templateUrl: './question-dashboard.html',
  styleUrl: './question-dashboard.scss',
})
export class QuestionDashboard {
  private router = inject(Router);
  private qService = inject(QuestionnaireService);

  // Свойства для шаблона (подтягиваем из сервиса)
  questions = this.qService.QUESTIONS;
  scoreLabels = this.qService.SCORE_LABELS;

  // Состояние формы
  answers: Record<number, number> = {};
  headerLabel: string = '';
  timePoint: number = 0;

  ngOnInit() {
    // 1. Получаем временную точку из сессии
    const savedTp = sessionStorage.getItem('fillTimePoint');
    this.timePoint = savedTp ? parseInt(savedTp) : 0;

    // 2. Получаем красивый текст хедера из сервиса
    this.headerLabel = this.qService.getTimePointLabel(this.timePoint);
  }

  // Универсальный метод для записи ответов (и для 1-10, и для 11 вопроса)
  handleAnswer(qId: number, score: number) {
    this.answers[qId] = score;
  }

  // Считаем сумму баллов (только для первых 10 вопросов)
  get totalScore(): number {
    return Object.keys(this.answers)
      .map(Number)
      .filter((id) => id >= 1 && id <= 10)
      .reduce((sum, id) => sum + this.answers[id], 0);
  }

  // Проверка: заполнены ли все 11 пунктов (10 вопросов + 1 satisfaction)
  get isComplete(): boolean {
    return Object.keys(this.answers).length === 11;
  }

  // Метод для выхода/отмены
  onCancelRequested() {
    if (confirm('Вы уверены, что хотите выйти? Прогресс будет потерян.')) {
      this.cleanupAndExit();
    }
  }

  // Сохранение данных
  async saveResults() {
    if (!this.isComplete) return;

    const patientId = sessionStorage.getItem('patientId') || 'guest';

    // Формируем объект точно так же, как в твоем JS
    const result = {
      patient_id: patientId,
      time_point: this.timePoint,
      answers: this.answers, // Сохраняем весь объект ответов
      total_score: this.totalScore,
      satisfaction: this.answers[11],
      completed_at: new Date().toISOString(),
    };

    try {
      await this.qService.saveQuestionnaireResult(result);
      alert(`Готово! Ваш балл: ${this.totalScore}/50`);
      this.cleanupAndExit();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось отправить данные.');
    }
  }

  private cleanupAndExit() {
    sessionStorage.removeItem('fillTimePoint');
    this.router.navigate(['/patient-dashboard']);
  }
}

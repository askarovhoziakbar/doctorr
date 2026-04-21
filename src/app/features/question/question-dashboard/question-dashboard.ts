import { Component, inject } from '@angular/core';
import { QuestionHeader } from '../components/question-header/question-header';
import { QuestionnaireService } from '../../../core/services/questionnaire-service';
import { Router } from '@angular/router';
import { QuestionCard } from '../components/question-card/question-card';
import { CommonModule } from '@angular/common';
import { QuestionnaireFooter } from '../components/questionnaire-footer/questionnaire-footer';
import { SatisfactionCard } from '../components/satisfaction-card/satisfaction-card';
import { QuestionnaireInstructions } from '../components/questionnaire-instructions/questionnaire-instructions';

@Component({
  selector: 'app-question-dashboard',
  imports: [
    QuestionHeader,
    QuestionCard,
    CommonModule,
    QuestionnaireFooter,
    SatisfactionCard,
    QuestionnaireInstructions,
  ],
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
  answers: Record<string | number, number> = {};
  headerLabel: string = '';
  timePoint: number = 0;

  // При загрузке компонента
  ngOnInit() {
    const savedTp = sessionStorage.getItem('fillTimePoint');
    this.timePoint = savedTp ? parseInt(savedTp) : 0;

    // 2. Получаем красивый текст хедера из сервиса
    this.headerLabel = this.qService.getTimePointLabel(this.timePoint);
  }

  handleAnswer(qId: number | string, score: number) {
    // Реактивное обновление объекта
    this.answers = {
      ...this.answers,
      [qId]: score,
    };
    console.log(`Вопрос ${qId} обновлен, значение: ${score}`);
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

    const patientId = sessionStorage.getItem('patientId');

    if (!patientId) {
      alert('Ошибка: ID пациента не найден. Пожалуйста, перезайдите в систему.');
      this.router.navigate(['/login']);
      return;
    }

    const interpretation = this.qService.getInterpretation(this.totalScore);

    const result = {
      patient_id: patientId,
      time_point: this.timePoint,
      answers: this.answers,
      total_score: this.totalScore,
      satisfaction: this.answers[11],
      completed_at: new Date().toISOString(),
    };

    try {
      await this.qService.saveQuestionnaireResult(result);

      await this.qService.updateNotificationStatus(patientId, this.timePoint);

      alert(
        `Опросник успешно отправлен!\n\n` +
          `Ваш балл GERD-HRQL: ${this.totalScore}/50\n\n` +
          `${interpretation}`,
      );

      this.cleanupAndExit();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось отправить данные. Попробуйте еще раз.');
    }
  }

  private cleanupAndExit() {
    sessionStorage.removeItem('fillTimePoint');
    this.router.navigate(['/patient-dashboard']);
  }
}

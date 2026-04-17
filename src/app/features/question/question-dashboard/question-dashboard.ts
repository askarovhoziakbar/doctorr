import { Component, inject } from '@angular/core';
import { QuestionHeader } from '../components/question-header/question-header';
import { QuestionnaireService } from '../../../core/services/questionnaire-service';
import { Router } from '@angular/router';
import { QuestionCard } from '../components/question-card/question-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-dashboard',
  imports: [QuestionHeader, QuestionCard, CommonModule],
  templateUrl: './question-dashboard.html',
  styleUrl: './question-dashboard.scss',
})
export class QuestionDashboard {
  private qService = inject(QuestionnaireService);
  private router = inject(Router);

  headerLabel: string = '';

  ngOnInit() {
    // 1. Читаем ID точки из сессии (как в твоем JS)
    //const tp = parseInt(sessionStorage.getItem('fillTimePoint') || '');
    const tp = 3; // Сохраняем для отладки

    if (isNaN(tp)) {
      alert('Ошибка: временная точка не найдена');
      this.router.navigate(['/patient-dashboard']);
      return;
    }

    this.headerLabel = this.qService.getTimePointLabel(tp);
  }

  // 3. Эта функция поймает сигнал отмены от хедера
  onCancelRequested() {
    sessionStorage.removeItem('fillTimePoint'); // Очищаем за собой
    this.router.navigate(['/patient-dashboard']); // Уходим
  }

  questions = this.qService.QUESTIONS;
  scoreLabels = this.qService.SCORE_LABELS;
  answers: Record<number, number> = {}; // Здесь будем хранить ответы {1: 5, 2: 0 ...}

  handleAnswer(qId: number, score: number) {
    this.answers[qId] = score;
    console.log('Текущие ответы:', this.answers);
  }
}

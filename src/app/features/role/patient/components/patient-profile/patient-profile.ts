import { Component, inject } from '@angular/core';
import { PatientService } from '../../../../../core/services/patient-service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu);

@Component({
  selector: 'app-patient-profile',
  imports: [CommonModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.scss',
})
export class PatientProfile {
  public patientService = inject(PatientService);

  // Хелпер для определения цвета балла (как в твоем JS)
  getScoreClass(score: number): string {
    console.log(`[UI] Отрисовка балла: ${score}`);
    if (score <= 10) return 'badge-success';
    if (score <= 25) return 'badge-warning';
    return 'badge-danger';
  }

  // Метод для кнопки "Просмотр"
  viewDetails(id: string) {
    console.log(`[Action] Открытие опросника: ${id}`);
    // Тут позже добавим открытие модалки
  }

  // Метод для кнопки "Заполнить"
  fillNow(tp: number) {
    console.log(`[Action] Переход к заполнению точки: ${tp}`);
    // Тут будет переход на страницу опросника
  }

  sendTestScore(tp: number) {
    const manualScore = prompt(`Введите балл для этапа ${tp} месяцев (от 0 до 50):`);

    if (manualScore !== null) {
      const scoreNum = parseInt(manualScore);
      this.patientService.addManualSurvey(tp, scoreNum);
    }
  }
}

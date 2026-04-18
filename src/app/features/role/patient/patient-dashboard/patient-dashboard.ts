import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore-service';
import { DashboardHeader } from '../components/dashboard-header/dashboard-header';
import { PatientTimeline } from '../components/patient-timeline/patient-timeline';
import { PatientService } from '../../../../core/services/patient-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  imports: [DashboardHeader, PatientTimeline],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss',
})
export class PatientDashboard {
  private router = inject(Router);
  public pService = inject(PatientService);

  // 1. Функция для кнопки "Заполнить"
  onFillQuestionnaire(timePoint: number) {
    // Сохраняем точку, чтобы страница опросника знала, что мы заполняем
    sessionStorage.setItem('fillTimePoint', timePoint.toString());
    // Переходим на страницу опросника (проверь, как называется твой роут)
    this.router.navigate(['/questionnaire']);
  }

  // 2. Функция для кнопки "Просмотр"
  onViewQuestionnaire(reportId: string) {
    console.log('Открываем отчет с ID:', reportId);
    // Здесь позже напишем открытие модалки с деталями
  }
}

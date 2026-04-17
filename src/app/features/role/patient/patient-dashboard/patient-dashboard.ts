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
  public firestoreService = inject(FirestoreService);
  public pService = inject(PatientService);
  private router = inject(Router);

  onFillQuestionnaire(timePoint: number) {
    // Сохраняем точку в сессию, как в твоем JS
    sessionStorage.setItem('fillTimePoint', timePoint.toString());
    // Уходим на страницу опросника
    this.router.navigate(['/questionnaire']);
  }

  onViewQuestionnaire(reportId: string) {
    console.log('Открываем просмотр опросника с ID:', reportId);
    // Здесь позже добавим логику открытия модального окна
  }
}

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
  public pService = inject(PatientService);
  private router = inject(Router);

  ngOnInit() {
    // 1. Получаем ID пациента из Auth (или sessionStorage, если ты так сделал)
    const patientId = sessionStorage.getItem('patientId'); // Или твой authService.id

    // 2. Обязательно вызываем метод загрузки в сервисе!
    if (patientId) {
      this.pService.loadPatientData(patientId);
    }
  }

  onFill(tp: number) {
    sessionStorage.setItem('fillTimePoint', tp.toString());
    this.router.navigate(['/questionnaire']);
  }

  onView(id: string) {
    console.log('Просмотр опросника:', id);
    // Логика открытия модалки
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { FirestoreService } from '../../../../../core/services/firestore-service';

@Component({
  selector: 'app-stats-grid',
  imports: [],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.scss',
})
export class StatsGrid {
  private firestoreService = inject(FirestoreService);

  patients = signal<any[]>([]);
  reports = signal<any[]>([]); // Добавляем сигнал для отчетов

  // 1. Всего пациентов (из коллекции patient)
  totalPatients = computed(() => this.patients().length);

  // 2. Заполненные опросники
  // Считаем количество уникальных userId в отчетах
  completedQuestionnaires = computed(() => {
    const reportList = this.reports();

    // Используем корректное имя поля: patient_id
    const uniqueUsers = new Set(
      reportList
        .filter((r) => r.patient_id) // Проверяем, что поле вообще есть в документе
        .map((r) => r.patient_id),
    );

    return uniqueUsers.size;
  });

  pendingQuestionnaires = computed(() => {
    return this.totalPatients() - this.completedQuestionnaires();
  });
  // 3. Средний балл по всем отчетам
  // 4. Средний балл
  averageScore = computed(() => {
    const reportList = this.reports();
    if (reportList.length === 0) return 0;

    // Замени 'total_score' на реальное название поля с баллами в твоей базе
    const sum = reportList.reduce((acc, r) => acc + (Number(r.total_score) || 0), 0);
    return Math.round(sum / reportList.length);
  });

  ngOnInit() {
    // Получаем пациентов
    this.firestoreService.getPatients().subscribe((data: any[]) => {
      this.patients.set(data);
    });

    // Теперь getReports перестанет быть красным!
    this.firestoreService.getReports().subscribe((data: any[]) => {
      this.reports.set(data);
    });
  }
}

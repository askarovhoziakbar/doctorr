import { inject, Injectable, NgZone, signal, computed } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

export interface Questionnaire {
  id?: string;
  patientId: string;
  timePoint: number;
  totalScore: number;
  completedAt: any;
  satisfaction: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private firestore = inject(Firestore);
  private zone = inject(NgZone);

  currentPatient = signal<any>(null);
  questionnaires = signal<any[]>([]);

  constructor() {
    this.initPatient();
  }

  private initPatient() {
    const id = sessionStorage.getItem('patientId');

    if (id) {
      this.loadPatientData(id);
      this.loadQuestionnaires(id);
    }
  }

  // 1. ПОЛУЧЕНИЕ ДАННЫХ ПРОФИЛЯ ПО ID
  async loadPatientData(id: string) {
    try {
      const docRef = doc(this.firestore, `patient/${id}`);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        this.zone.run(() => this.currentPatient.set(data));
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
    }
  }

  // 2. ПОЛУЧЕНИЕ ВСЕХ ОПРОСНИКОВ ПО ID ПАЦИЕНТА
  async loadQuestionnaires(patientId: string) {
    try {
      const q = query(
        collection(this.firestore, 'questionnaires'),
        where('patientId', '==', patientId),
        orderBy('timePoint', 'asc'),
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      this.zone.run(() => this.questionnaires.set(list));
    } catch (err) {
      console.error('Ошибка загрузки опросников:', err);
    }
  }

  timeline = computed(() => {
    const patient = this.currentPatient();
    const reports = this.questionnaires();

    if (!patient || !patient.registration_date) return [];

    const regDate = new Date(patient.registration_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем время для точности как в JS

    const timePoints = [
      { label: 'Первый визит', months: 0, tp: 0 },
      { label: '3 месяца', months: 3, tp: 3 },
      { label: '6 месяцев', months: 6, tp: 6 },
      { label: '12 месяцев', months: 12, tp: 12 },
    ];

    return timePoints.map((point) => {
      // 1. Считаем дедлайн (registration_date + N месяцев)
      const dueDate = new Date(regDate);
      dueDate.setMonth(dueDate.getMonth() + point.months);
      dueDate.setHours(0, 0, 0, 0);

      // 2. Ищем, заполнен ли опросник для этой точки
      const report = reports.find((r) => r.time_point === point.tp || r.timePoint === point.tp);

      // 3. Считаем разницу в днях (из твоего JS)
      const diffTime = dueDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 4. Определяем статус
      let status: 'complete' | 'overdue' | 'pending' = 'pending';
      if (report) {
        status = 'complete';
      } else if (today >= dueDate) {
        status = 'overdue';
      }

      // 5. Логика доступности кнопки (твои 7 дней из JS)
      const canFill = !report && (daysUntil <= 7 || today >= dueDate);

      return {
        ...point,
        dueDate,
        report,
        status,
        canFill,
        daysUntil,
        statusText: this.generateStatusText(status, daysUntil, dueDate, report),
      };
    });
  });

  // Вспомогательный метод для текста статуса (как в твоем JS)
  private generateStatusText(status: string, days: number, dueDate: Date, report: any): string {
    if (status === 'complete') {
      return `Заполнен`; // Дату добавим через Pipe в HTML
    }
    if (status === 'overdue') {
      return 'Просрочен';
    }
    if (days <= 7) {
      return 'Доступен для заполнения';
    }
    return `Доступен через ${days} дн.`;
  }

  // Твои пороги баллов из JS
  getScoreBadge(score: number): string {
    if (score <= 10) return 'badge-success';
    if (score <= 25) return 'badge-warning';
    return 'badge-danger';
  }
}

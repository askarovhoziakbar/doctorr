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

  public async initPatient() {
    const id = sessionStorage.getItem('patientId');

    if (id) {
      await Promise.all([this.loadPatientData(id), this.loadQuestionnaires(id)]);

      return {
        patient: this.currentPatient(),
        questionnaires: this.questionnaires(),
      };
    }

    return null;
  }

  // 1. ПОЛУЧЕНИЕ ДАННЫХ ПРОФИЛЯ ПО ID
  async loadPatientData(id: string) {
    try {
      const docRef = doc(this.firestore, `patient/${id}`);
      const snap = await getDoc(docRef);
      console.log('Загрузка профиля пациента:', snap.data());
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
      const q = query(collection(this.firestore, 'reports'), where('patient_id', '==', patientId));

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

    // 1. Проверяем createdAt (как в твоем Firebase)
    // Если данных еще нет, сервис вернет пустой массив
    if (!patient || !patient.createdAt) return [];

    // Конвертируем Firebase Timestamp в JavaScript Date
    // Firebase Timestamp имеет метод toDate()
    const regDate = patient.createdAt.toDate
      ? patient.createdAt.toDate()
      : new Date(patient.createdAt);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const points = [
      { label: 'Первый визит', months: 0, tp: 0 },
      { label: '3 месяца', months: 3, tp: 3 },
      { label: '6 месяцев', months: 6, tp: 6 },
      { label: '12 месяцев', months: 12, tp: 12 },
    ];

    return points.map((p) => {
      const dueDate = new Date(regDate);
      dueDate.setMonth(dueDate.getMonth() + p.months);
      dueDate.setHours(0, 0, 0, 0);

      const report = reports.find((r) => r.timePoint === p.tp || r.time_point === p.tp);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status: 'complete' | 'overdue' | 'pending' = 'pending';
      if (report) {
        status = 'complete';
      } else if (today >= dueDate) {
        status = 'overdue';
      }

      return {
        ...p,
        dueDate,
        report,
        status,
        canFill: !report && (diffDays <= 7 || today >= dueDate),
        statusText: report
          ? `Заполнен ${new Date(report.completedAt?.seconds * 1000 || report.completedAt).toLocaleDateString('ru-RU')}`
          : today >= dueDate
            ? 'Просрочен'
            : `Доступен с ${dueDate.toLocaleDateString('ru-RU')} (через ${diffDays} дн.)`,
      };
    });
  });

  getScoreBadge(score: number) {
    if (score <= 10) return 'badge-success';
    if (score <= 25) return 'badge-warning';
    return 'badge-danger';
  }
}

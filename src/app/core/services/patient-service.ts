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

  // Сигналы состояния
  currentPatient = signal<any>(null);
  questionnaires = signal<Questionnaire[]>([]);

  constructor() {
    this.initPatient();
  }

  private initPatient() {
    const id = sessionStorage.getItem('patientId');
    console.log('1. [Service Init] Проверка ID в сессии:', id);

    if (id) {
      this.loadPatientData(id);
      this.loadQuestionnaires(id);
    } else {
      console.warn('1. [Service Init] ID пациента не найден!');
    }
  }

  // 1. Загрузка данных профиля
  async loadPatientData(id: string) {
    try {
      console.log('2. [Firebase] Загрузка профиля пациента...');
      const docRef = doc(this.firestore, `patient/${id}`);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        this.zone.run(() => {
          this.currentPatient.set(data);
          console.log('2. [Success] Профиль пациента загружен в сигнал');
        });
      } else {
        console.error('2. [Error] Документ не найден в коллекции "patient"');
      }
    } catch (err) {
      console.error('2. [Error] Ошибка Firestore при загрузке профиля:', err);
    }
  }

  // 2. Загрузка опросников
  async loadQuestionnaires(patientId: string) {
    try {
      console.log('3. [Firebase] Загрузка опросников для пациента:', patientId);
      const q = query(
        collection(this.firestore, 'questionnaires'),
        where('patientId', '==', patientId),
        orderBy('timePoint', 'asc'),
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Questionnaire);

      this.zone.run(() => {
        this.questionnaires.set(list);
        console.log(`3. [Success] Загружено опросников: ${list.length}`);
      });
    } catch (err) {
      console.error('3. [Error] Ошибка загрузки опросников:', err);
    }
  }

  // 3. Логика Таймлайна (Computed)
  timelinePoints = computed(() => {
    const patient = this.currentPatient();
    const qs = this.questionnaires();

    if (!patient || !patient.createdAt) {
      console.log('4. [Computed] Таймлайн пуст: нет данных пациента или даты регистрации');
      return [];
    }

    console.log('4. [Computed] Пересчет точек таймлайна...');

    // Обработка даты регистрации (Timestamp или Date)
    const regDate =
      patient.createdAt instanceof Timestamp
        ? patient.createdAt.toDate()
        : new Date(patient.createdAt);

    const today = new Date();

    const config = [
      { label: 'Первый визит', months: 0, tp: 0 },
      { label: '3 месяца', months: 3, tp: 3 },
      { label: '6 месяцев', months: 6, tp: 6 },
      { label: '12 месяцев', months: 12, tp: 12 },
    ];

    return config.map((point) => {
      const questionnaire = qs.find((q) => q.timePoint === point.tp);
      const dueDate = new Date(regDate);
      dueDate.setMonth(dueDate.getMonth() + point.months);

      // Считаем разницу в днях
      const diffMs = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let status: 'complete' | 'pending' | 'overdue' | 'available' = 'pending';

      if (questionnaire) {
        status = 'complete';
      } else if (today > dueDate) {
        status = 'overdue';
      } else if (diffDays <= 7) {
        status = 'available';
      }

      return {
        ...point,
        dueDate,
        questionnaire,
        status,
        daysUntil: diffDays,
      };
    });
  });

  async addManualSurvey(timePoint: number, score: number) {
    const patientId = sessionStorage.getItem('patientId');

    if (!patientId) {
      console.error('Ошибка: ID пациента не найден в сессии');
      return;
    }

    console.log(`[Manual Action] Отправка данных: Точка ${timePoint}, Балл ${score}`);

    try {
      const data = {
        patientId: patientId,
        timePoint: timePoint,
        totalScore: score,
        completedAt: serverTimestamp(), // Время сервера
        answers: [], // Пока пусто, так как вводим вручную
        satisfaction: 'Введено вручную',
      };

      const docRef = await addDoc(collection(this.firestore, 'questionnaires'), data);
      console.log('3. [Success] Опросник сохранен с ID:', docRef.id);

      // После сохранения обновляем список опросников, чтобы Таймлайн сразу изменился
      await this.loadQuestionnaires(patientId);
    } catch (err) {
      console.error('Ошибка при сохранении опросника:', err);
    }
  }
}

import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private firestore = inject(Firestore);

  // Переносим вопросы из твоего JS сюда
  readonly QUESTIONS = [
    { id: 1, text: 'Как сильно вас беспокоит изжога?' },
    { id: 2, text: 'Беспокоит ли вас изжога в положении лежа?' },
    { id: 3, text: 'Беспокоит ли вас изжога в положении стоя?' },
    { id: 4, text: 'Беспокоит ли вас изжога после еды?' },
    { id: 5, text: 'Влияет ли изжога на вашу диету?' },
    { id: 6, text: 'Просыпаетесь ли вы от изжоги?' },
    { id: 7, text: 'Беспокоит ли вас регургитация (заброс пищи)?' },
    { id: 8, text: 'Беспокоит ли вас затруднение при глотании?' },
    { id: 9, text: 'Беспокоит ли вас боль при глотании?' },
    { id: 10, text: 'Влияют ли лекарства на вашу повседневную жизнь?' },
  ];

  // Метки для баллов (0-5)
  readonly SCORE_LABELS = [
    'нет симптома',
    'есть, но не беспокоит',
    'иногда беспокоит',
    'часто беспокоит',
    'беспокоит постоянно',
    'мешает повседневной деятельности',
  ];

  // Логика отображения временных точек (displayTimePointInfo из JS)
  getTimePointLabel(tp: number): string {
    const labels: Record<number, string> = {
      0: 'Первый визит (исходный уровень)',
      3: '3 месяца после первого визита',
      6: '6 месяцев после первого визита',
      12: '12 месяцев после первого визита',
    };
    return labels[tp] || `Временная точка: ${tp} месяцев`;
  }

  getInterpretation(score: number): string {
    if (score <= 10) {
      return '🟢 Легкие симптомы ГЭРБ';
    } else if (score <= 20) {
      return '🟡 Умеренные симптомы ГЭРБ';
    } else if (score <= 35) {
      return '🟠 Выраженные симптомы ГЭРБ';
    } else {
      return '🔴 Тяжелые симптомы ГЭРБ';
    }
  }

  // Сохранение в Firebase Firestore
  async saveQuestionnaireResult(data: any) {
    // В Firestore коллекция будет называться 'reports' или 'questionnaires'
    const reportsCollection = collection(this.firestore, 'reports');
    return addDoc(reportsCollection, {
      ...data,
      serverTimestamp: new Date(), // Добавляем время сервера для надежности
    });
  }
  async updateNotificationStatus(patientId: string, timePoint: number) {
    try {
      // Здесь должна быть логика поиска уведомления в Firestore и смена его статуса на 'completed'
      // Примерная логика (зависит от твоей структуры БД):
      /*
    const q = query(
      collection(this.firestore, 'notifications'), 
      where('patient_id', '==', patientId),
      where('time_point', '==', timePoint)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      await updateDoc(docSnap.ref, { status: 'completed' });
    });
    */
      console.log('Статус уведомления обновлен');
    } catch (e) {
      console.error('Ошибка обновления статуса:', e);
    }
  }
}

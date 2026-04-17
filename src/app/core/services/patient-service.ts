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
}

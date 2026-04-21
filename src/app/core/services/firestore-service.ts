import { inject, Injectable, signal } from '@angular/core';
import { NgZone } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  collectionData,
} from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';
import { PatientService } from './patient-service';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private patientService = inject(PatientService);

  userRole = signal<string | null>(sessionStorage.getItem('user_role'));

  // Метод для выхода из системы
  logout() {
    this.userRole.set(null);
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('patientId');
    this.patientService.currentPatient.set(null);
    this.router.navigate(['/auth']);
  }

  // Вспомогательный метод для получения ссылки на коллекцию
  private getColRef(path: string) {
    return collection(this.firestore, path);
  }

  // Метод для отправки данных в Firestore
  async sendData<T extends object>(path: string, data: T) {
    try {
      const dataWithTime = { ...data, createdAt: serverTimestamp() };

      return await addDoc(this.getColRef(path), dataWithTime);
    } catch (error) {
      console.error('Ошибка в сервисе:', error);
      throw error;
    }
  }

  // Метод для проверки существования номера телефона
  async checkPhoneExists(phone: string): Promise<boolean> {
    const collections = ['patient', 'doctor'];

    for (const path of collections) {
      const q = query(this.getColRef(path), where('phone', '==', phone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log(`Номер ${phone} найден в коллекции: ${path}`);
        return true;
      }
    }

    return false;
  }

  // Метод для проверки логина и получения роли пользователя
  async login(phone: string, pass: string): Promise<{ success: boolean; role?: string }> {
    const collections = ['patient', 'doctor'];

    for (const path of collections) {
      const q = query(
        this.getColRef(path),
        where('phone', '==', phone),
        where('password', '==', pass),
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const docSnap = snap.docs[0];
        const data = docSnap.data() as any;
        const userId = docSnap.id;

        this.userRole.set(data.role);
        sessionStorage.setItem('user_role', data.role);
        sessionStorage.setItem('patientId', userId);

        if (data.role === 'patient') {
          this.patientService.loadPatientData(userId);
        }

        console.log(`Вход выполнен! Роль: ${data.role}, ID: ${userId}`);
        return { success: true, role: data.role };
      }
    }

    return { success: false };
  }

  async createPatient(data: any) {
    // Указываем только коллекцию, без конкретного ID
    const patientsRef = collection(this.firestore, 'patient');

    try {
      // addDoc сам сгенерирует случайный ID в Firebase
      return await addDoc(patientsRef, data);
    } catch (e) {
      console.error('Ошибка при добавлении:', e);
      throw e;
    }
  }

  redirectUser() {
    const role = this.userRole() || sessionStorage.getItem('user_role');
    const userId = sessionStorage.getItem('patientId'); // Или 'doctorId'

    if (role === 'patient' && userId) {
      this.router.navigate(['/patient-dashboard']);
    } else if (role === 'doctor' && userId) {
      this.router.navigate(['/doctor-dashboard']);
    } else {
      console.warn('Ошибка редиректа: роль или ID отсутствуют');
      this.router.navigate(['/auth']);
    }
  }

  getPatients(): Observable<any[]> {
    const patientsRef = collection(this.firestore, 'patient');
    // Превращаем Promise от Firebase в Observable через from
    return from(getDocs(patientsRef)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
    );
  }

  getReports(): Observable<any[]> {
    const reportsRef = collection(this.firestore, 'reports'); // Название коллекции в Firebase

    return from(getDocs(reportsRef)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ),
    );
  }
}

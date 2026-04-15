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
} from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private router = inject(Router);

  userRole = signal<string | null>(sessionStorage.getItem('user_role'));

  // Метод для выхода из системы
  logout() {
    this.userRole.set(null);
    sessionStorage.removeItem('user_role');
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
        const data = snap.docs[0].data() as any;

        this.userRole.set(data.role);
        sessionStorage.setItem('user_role', data.role);

        console.log(`Вход выполнен! Ваша роль в базе: ${data.role}`);

        return { success: true, role: data.role };
      }
    }

    return { success: false };
  }

  redirectUser() {
    const role = this.userRole();
    if (role === 'patient') {
      this.router.navigate(['/patient-dashboard']);
    } else if (role === 'doctor') {
      this.router.navigate(['/doctor-dashboard']);
    } else {
      this.router.navigate(['/auth']);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../../core/services/firestore-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private firestoreService = inject(FirestoreService);
  phone = signal('');
  password = signal('');
  errorMessage = signal('');

  // Метод для обработки входа
  async onLogin() {
    const phone = this.phone();
    const pass = this.password();

    try {
      const result = await this.firestoreService.login(phone, pass);

      if (result.success) {
        console.log(`true. Роль пользователя: ${result.role}`);

        this.firestoreService.redirectUser();
      } else {
        alert('Ошибка: Данные не совпадают');
      }
    } catch (e) {
      console.error('Ошибка при входе:', e);
    }
  }
}

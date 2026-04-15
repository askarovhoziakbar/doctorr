import { Component, computed, inject, signal } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore-service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private firestoreService = inject(FirestoreService);

  // Вычисляемое свойство для проверки совпадения паролей
  passwordsMatch = computed(() => {
    return this.password() === this.passwordConfirm() && this.password() !== '';
  });

  // Сигналы для хранения данных формы
  firstName = signal('');
  lastName = signal('');
  phone = signal('');
  birthDate = signal('');
  email = signal('');
  password = signal('');
  passwordConfirm = signal('');

  // Сигналы для управления состоянием формы
  wasSubmitted = signal(false);
  phoneExistsError = signal(false);

  // Метод для обработки регистрации
  async onRegister() {
    this.wasSubmitted.set(true);
    this.phoneExistsError.set(false);

    if (!this.passwordsMatch()) return;

    try {
      const isBusy = await this.firestoreService.checkPhoneExists(this.phone());

      if (isBusy) {
        this.phoneExistsError.set(true);
        return;
      }

      const dataToSend: User = {
        firstName: this.firstName(),
        lastName: this.lastName(),
        phone: this.phone(),
        birthDate: this.birthDate(),
        email: this.email(),
        password: this.password(),
        role: 'patient',
      };

      const result = await this.firestoreService.sendData<User>('patient', dataToSend);

      this.firestoreService.userRole.set('patient');
      sessionStorage.setItem('user_role', 'patient');

      this.firestoreService.redirectUser();

      console.log(`Документ создан! ID: ${result.id}\nДанные:`, dataToSend);

      this.wasSubmitted.set(false);
    } catch (e) {
      console.log('Что-то пошло не так', e);
    }
  }
}

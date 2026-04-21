import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../../core/services/firestore-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-patient-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-patient-modal.html',
  styleUrl: './add-patient-modal.scss',
})
export class AddPatientModal {
  @Input() isOpen = false;
  @Output() closeId = new EventEmitter<void>();
  @Output() patientAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);

  addPatientForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  close() {
    this.addPatientForm.reset();
    this.closeId.emit();
  }

  onOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.close();
    }
  }

  phoneError: string | null = null;

  async onSubmit() {
    if (this.addPatientForm.invalid) return;

    this.phoneError = null; // Сбрасываем старую ошибку
    const data = this.addPatientForm.value;

    try {
      // Проверяем телефон через твой сервис
      const isPhoneUsed = await this.firestoreService.checkPhoneExists(data.phone);

      if (isPhoneUsed) {
        // Если номер есть, записываем текст в переменную
        this.phoneError = 'Этот номер телефона уже занят';
        return;
      }

      // Если номера нет — идем дальше и сохраняем
      const patientData = {
        ...data,
        createdAt: new Date().toLocaleDateString('ru-RU'),
        role: 'patient',
      };

      await this.firestoreService.createPatient(patientData);
      this.patientAdded.emit();
      this.close();
    } catch (error) {
      console.error(error);
      this.phoneError = 'Ошибка при проверке номера';
    }
  }

  // Метод, чтобы убрать ошибку, когда пользователь начал менять номер
  clearPhoneError() {
    this.phoneError = null;
  }
}

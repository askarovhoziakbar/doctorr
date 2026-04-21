import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile',
  imports: [CommonModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.scss',
})
export class PatientProfile {
  @Input() patient: any;

  calculateAge(birthData: any): number {
    if (!birthData) return 0;

    // Пробуем получить дату из разных форматов Firebase
    let birth: Date;
    if (birthData.toDate) {
      birth = birthData.toDate();
    } else if (birthData.seconds) {
      birth = new Date(birthData.seconds * 1000);
    } else {
      birth = new Date(birthData);
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }
}

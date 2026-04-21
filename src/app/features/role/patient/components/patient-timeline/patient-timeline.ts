import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../../core/services/patient-service';

@Component({
  selector: 'app-patient-timeline',
  imports: [CommonModule],
  templateUrl: './patient-timeline.html',
  styleUrl: './patient-timeline.scss',
})
export class PatientTimeline {
  public pService = inject(PatientService);

  // События для родительского компонента
  @Output() fill = new EventEmitter<number>();
  @Output() view = new EventEmitter<string>();

  ngOnInit(): void {
    this.pService.initPatient().then((res) => {
      console.log('Инициализация данных пациента завершена:', res);
    });
  }

  // Метод для получения цвета бейджа (из твоей логики JS)
  getBadgeClass(score: number): string {
    return this.pService.getScoreBadge(score);
  }

  // Написать метод для получения обще заполненных данных для отображения в шаблоне
  /*getTimelineData() {
    const patient = this.pService.currentPatient();
    const questionnaires = this.pService.questionnaires();
    // Логика для получения данных временной шкалы
    console.log('Получение данных для временной шкалы:', { patient, questionnaires });
  }*/
}

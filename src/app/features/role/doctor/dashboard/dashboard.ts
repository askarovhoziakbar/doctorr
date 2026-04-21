import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { AddPatientModal } from '../components/add-patient-modal/add-patient-modal';
import { CommonModule } from '@angular/common';
import { StatsGrid } from '../components/stats-grid/stats-grid';
import { PatientsList } from '../components/patients-list/patients-list';

@Component({
  selector: 'app-dashboard',
  imports: [Header, AddPatientModal, CommonModule, StatsGrid, PatientsList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  isModalOpen = false;

  // 2. Объявляем массив для данных (как в твоем JS)
  allPatients: any[] = [];

  ngOnInit() {
    this.loadAllData();
  }

  // 3. Создаем метод загрузки данных
  async loadAllData() {
    console.log('Загрузка данных...');
    // Тут позже напишем логику получения данных из Firebase
  }
}

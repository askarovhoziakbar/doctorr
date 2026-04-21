import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../../../core/services/firestore-service';

@Component({
  selector: 'app-patients-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './patients-list.html',
  styleUrl: './patients-list.scss',
})
export class PatientsList {
  private firestoreService = inject(FirestoreService);

  // Состояние отображения (Сигналы)
  viewMode = signal<'table' | 'cards'>('table');
  searchQuery = signal('');
  isRefreshing = signal(false);

  // Данные
  patients = signal<any[]>([]);

  // Всего пациентов (до фильтрации)
  totalCount = computed(() => this.patients().length);

  // Фильтрация (то, что идет в таблицу/карточки)
  filteredPatients = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.patients();

    return this.patients().filter(
      (p) =>
        p.firstName?.toLowerCase().includes(query) ||
        p.lastName?.toLowerCase().includes(query) ||
        p.phone?.includes(query) ||
        p.email?.toLowerCase().includes(query),
    );
  });

  ngOnInit() {
    this.loadPatients();
  }

  // Загрузка данных
  loadPatients() {
    this.firestoreService.getPatients().subscribe({
      next: (data) => {
        this.patients.set(data);
        this.isRefreshing.set(false);
      },
      error: () => this.isRefreshing.set(false),
    });
  }

  // --- Методы из твоего HTML ---

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  switchView(mode: 'table' | 'cards') {
    this.viewMode.set(mode);
  }

  onRefresh() {
    this.isRefreshing.set(true);
    this.loadPatients();
  }

  // Вспомогательный метод для классов баллов
  getScoreClass(score: number): string {
    if (!score) return 'score-low';
    if (score > 28) return 'score-high'; // Пример логики: плохой результат
    if (score > 15) return 'score-mid';
    return 'score-low';
  }

  // Заглушки для кнопок действий
  editPatient(patient: any) {
    console.log('Редактировать:', patient);
  }

  viewDetails(patient: any) {
    console.log('Детали:', patient);
  }
}

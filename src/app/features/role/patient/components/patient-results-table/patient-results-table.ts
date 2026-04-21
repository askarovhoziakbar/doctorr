import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-results-table',
  imports: [CommonModule],
  templateUrl: './patient-results-table.html',
  styleUrl: './patient-results-table.scss',
})
export class PatientResultsTable {
  @Input() results: any[] = [];
  @Output() view = new EventEmitter<string>();

  getTimePointLabel(tp: number): string {
    const labels: any = { 0: 'Первый визит', 3: '3 месяца', 6: '6 месяцев', 12: '12 месяцев' };
    return labels[tp] || `${tp} мес.`;
  }

  getScoreClass(score: number): string {
    if (score <= 10) return 'badge-success';
    if (score <= 20) return 'badge-warning';
    return 'badge-danger';
  }

  // Тот самый маппинг удовлетворенности, который мы обсуждали
  getSatisfactionLabel(value: any): string {
    const labels: any = { 0: 'Удовлетворен', 1: 'Да и нет', 2: 'Не удовлетворен' };
    return labels[Number(value)] || '—';
  }
}

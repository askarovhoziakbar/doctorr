import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-patient-symptoms-chart',
  imports: [CommonModule],
  templateUrl: './patient-symptoms-chart.html',
  styleUrl: './patient-symptoms-chart.scss',
})
export class PatientSymptomsChart {
  // Принимаем данные опросников от родителя
  @Input() questionnaires: any[] = [];

  @ViewChild('symptomsChart') canvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | undefined;

  // Если данные изменятся (например, прилетели из Firebase), график обновится
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionnaires'] && this.canvas) {
      this.renderChart();
    }
  }

  // Отрисовка после загрузки вью
  ngAfterViewInit() {
    this.renderChart();
  }

  private renderChart() {
    if (!this.canvas || !this.questionnaires.length) return;

    // Удаляем старый график перед созданием нового, чтобы не было наслоений
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Сортируем опросники по временным точкам (0, 3, 6, 12), как в твоем JS
    const sortedData = [...this.questionnaires].sort((a, b) => a.time_point - b.time_point);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedData.map((q) => this.getTimePointLabel(q.time_point)),
        datasets: [
          {
            label: 'Балл GERD-HRQL',
            data: sortedData.map((q) => q.total_score),
            borderColor: '#667eea', // Твой фирменный цвет
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4, // Плавность линии
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#667eea',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false, position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => `Балл: ${context.parsed.y}/50`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            ticks: { stepSize: 10 },
            title: { display: true, text: 'Балл (0-50)' },
          },
          x: {
            title: { display: true, text: 'Временная точка' },
          },
        },
      },
    });
  }

  // Маппинг точек из твоего JS
  private getTimePointLabel(tp: number): string {
    const labels: any = {
      0: 'Первый визит',
      3: '3 месяца',
      6: '6 месяцев',
      12: '12 месяцев',
    };
    return labels[tp] || `${tp} мес.`;
  }
}

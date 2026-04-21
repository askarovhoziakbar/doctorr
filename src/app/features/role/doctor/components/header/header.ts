import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirestoreService } from '../../../../../core/services/firestore-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private firestoreService = inject(FirestoreService);

  @Input() isRefreshing: boolean = false; // Получаем состояние загрузки сверху
  @Output() addPatient = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  onAddPatient() {
    this.addPatient.emit();
  }

  onLogout() {
    this.firestoreService.logout();
  }
}

import { Component, computed, inject } from '@angular/core';
import { FirestoreService } from '../../../../../core/services/firestore-service';
import { PatientService } from '../../../../../core/services/patient-service';

@Component({
  selector: 'app-dashboard-header',
  imports: [],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss',
})
export class DashboardHeader {
  private firestoreService = inject(FirestoreService);
  public patientService = inject(PatientService);

  onLogout() {
    this.firestoreService.logout();
  }

  userName = computed(() => {
    const p = this.patientService.currentPatient();
    if (p) {
      return `${p.firstName} ${p.lastName || ''}`;
    }
    return 'Загрузка...';
  });
}

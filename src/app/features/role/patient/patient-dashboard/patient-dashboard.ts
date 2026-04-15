import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore-service';

@Component({
  selector: 'app-patient-dashboard',
  imports: [],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss',
})
export class PatientDashboard {
  public firestoreService = inject(FirestoreService);
}

import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore-service';
import { DashboardHeader } from '../components/dashboard-header/dashboard-header';
import { TimelineStatus } from '../components/timeline-status/timeline-status';
import { ResultsHistory } from '../components/results-history/results-history';
import { PatientProfile } from '../components/patient-profile/patient-profile';

@Component({
  selector: 'app-patient-dashboard',
  imports: [DashboardHeader, TimelineStatus, ResultsHistory, PatientProfile],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss',
})
export class PatientDashboard {
  public firestoreService = inject(FirestoreService);
}

import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/auth-page/auth-page';
import { PatientDashboard } from './features/role/patient/patient-dashboard/patient-dashboard';
import { roleGuard } from './core/guards/role.guard';
import { Dashboard } from './features/role/doctor/dashboard/dashboard';
import { QuestionDashboard } from './features/question/question-dashboard/question-dashboard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPage,
  },
  {
    path: 'doctor-dashboard',
    component: Dashboard,
    canActivate: [roleGuard],
    data: { expectedRole: 'doctor' },
  },
  {
    path: 'patient-dashboard',
    component: PatientDashboard,
    canActivate: [roleGuard],
    data: { expectedRole: 'patient' },
  },
  {
    path: 'questionnaire',
    component: QuestionDashboard,
    canActivate: [roleGuard],
    data: { expectedRole: 'patient' },
  },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];

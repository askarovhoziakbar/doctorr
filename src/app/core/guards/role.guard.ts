import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const firestoreService = inject(FirestoreService);
  const router = inject(Router);

  const userRole = firestoreService.userRole();
  const expectedRole = route.data['expectedRole'];

  console.log(`Проверка доступа: У пользователя роль [${userRole}], требуется [${expectedRole}]`);

  if (userRole === expectedRole) {
    return true;
  }

  console.warn('Доступ запрещен! Перенаправление на логин...');
  router.navigate(['/auth']);
  return false;
};

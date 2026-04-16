import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const firestoreService = inject(FirestoreService);
  const router = inject(Router);

  // 1. Пытаемся взять роль из сигнала
  let userRole = firestoreService.userRole();

  // 2. Если сигнал пустой (например, после F5), берем из sessionStorage
  if (!userRole) {
    userRole = sessionStorage.getItem('user_role');
  }

  // 3. Берем ID (без него мы не сможем загрузить данные профиля)
  const userId = sessionStorage.getItem('patientId');

  const expectedRole = route.data['expectedRole'];

  console.log(`Проверка: Роль [${userRole}], ID [${userId}], Требуется [${expectedRole}]`);

  // Проверяем: совпадает ли роль И есть ли у нас ID пользователя
  if (userRole === expectedRole && userId) {
    // Если мы восстановили роль из памяти, обновим сигнал в сервисе, чтобы другие компоненты его видели
    if (!firestoreService.userRole()) {
      firestoreService.userRole.set(userRole);
    }
    return true;
  }

  console.warn('Доступ запрещен или сессия истекла!');
  router.navigate(['/auth']);
  return false;
};

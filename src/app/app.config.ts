import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAJOoaWRSS5iD9LLERWRuPZlFU5WZiap8Y',
  authDomain: 'doctor-405b1.firebaseapp.com',
  projectId: 'doctor-405b1',
  storageBucket: 'doctor-405b1.firebasestorage.app',
  messagingSenderId: '104911201606',
  appId: '1:104911201606:web:e038645446ba912f9f3147',
  measurementId: 'G-ZHCLWDNLNC',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};

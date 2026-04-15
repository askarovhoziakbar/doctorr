import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  activeTab = signal<'login' | 'register'>('login');
  setTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
  }
}

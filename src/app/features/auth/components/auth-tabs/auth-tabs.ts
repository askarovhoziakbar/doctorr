import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-auth-tabs',
  imports: [],
  templateUrl: './auth-tabs.html',
  styleUrl: './auth-tabs.scss',
})
export class AuthTabs {
  private authService = inject(Auth);

  activeTab = this.authService.activeTab;
  setTab = this.authService.setTab;
}

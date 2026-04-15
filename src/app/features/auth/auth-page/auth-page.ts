import { Component, inject, signal } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore-service';
import { User } from '../../../core/models/user.interface';
import { Register } from '../components/register/register';
import { Login } from '../components/login/login';
import { AuthTabs } from '../components/auth-tabs/auth-tabs';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-auth-page',
  imports: [Register, Login, AuthTabs],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private authService = inject(Auth);

  activeTab = this.authService.activeTab;
}

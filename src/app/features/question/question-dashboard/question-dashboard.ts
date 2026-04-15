import { Component } from '@angular/core';
import { QuestionHeader } from '../components/question-header/question-header';

@Component({
  selector: 'app-question-dashboard',
  imports: [QuestionHeader],
  templateUrl: './question-dashboard.html',
  styleUrl: './question-dashboard.scss',
})
export class QuestionDashboard {}

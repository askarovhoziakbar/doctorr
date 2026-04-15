import { Component } from '@angular/core';

@Component({
  selector: 'app-question-header',
  imports: [],
  templateUrl: './question-header.html',
  styleUrl: './question-header.scss',
})
export class QuestionHeader {
  cancelQuestionnaire() {
    // Implement cancellation logic here, e.g., navigate back to the dashboard
    console.log('Questionnaire cancelled');
  }

  timePointLabel = 'Time Point 1'; // This can be dynamically set based on the current time point
}

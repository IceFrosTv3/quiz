import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {TestService} from '../../../shared/services/test.service';
import {QuizListType} from '../../../shared/types/quiz-list.type';
import {AuthService} from '../../../core/auth/auth.service';
import {DefaultResponseType} from '../../../shared/types/default-response.type';
import {TestResultType} from '../../../shared/types/test-result.type';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.scss'
})
export class ChoiceComponent implements OnInit {
  private readonly testService = inject(TestService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  protected quizzes: QuizListType[] = [];
  // testResults: TestResultType[] | null = null;

  ngOnInit() {
    this.testService.getTests().subscribe(res => this.quizzes = res);

    const userInfo = this.authService.getUserInfo()
    if (userInfo) {
      this.testService.getUserResults(userInfo.userId)
        .subscribe(result => {
          if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
            }

            const testResults = result as TestResultType[];
            if (testResults) {
              this.quizzes = this.quizzes.map(quiz => {
                const foundItem: TestResultType | undefined = testResults.find((item: TestResultType) => item.testId === quiz.id)
                if (foundItem) {
                  quiz.result = `${foundItem.score}/${foundItem.total}`
                }
                return quiz;
              })
            }
          }
        })
    }
  }

  protected chooseQuiz(id: number): void {
    this.router.navigate(['/test', id])
  }

  protected readonly String = String;
}

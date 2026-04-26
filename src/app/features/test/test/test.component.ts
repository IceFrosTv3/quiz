import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TestService} from '../../../shared/services/test.service';
import {DefaultResponseType} from '../../../shared/types/default-response.type';
import {QuizType} from '../../../shared/types/quiz.type';
import {ActionTestType} from "../../../shared/types/action-test.type";
import {UserResultTypes} from '../../../shared/types/user-result.types';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
class TestComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  testService = inject(TestService);
  authService = inject(AuthService);
  router = inject(Router);

  quiz!: QuizType
  timerSeconds = 59
  private interval = 0
  protected currentQuestionIndex = 1
  chosenAnswerId = signal<number | null>(null)
  readonly userResult: UserResultTypes[] = [];
  actionTestType = ActionTestType;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.testService.getQuiz(params['id']).subscribe(result => {
          if (result) {
            if ((result as DefaultResponseType).error) {
              return console.log((result as DefaultResponseType).message);
            }

            this.quiz = result as QuizType;
            this.interval = window.setInterval((): void => {
              this.timerSeconds--;
              if (this.timerSeconds === 0) {
                clearInterval(this.interval);
                this.complete();
              }
            }, 1000);
          }
        })
      }
    })
  }

  get activeQuestion() {
    return this.quiz.questions[this.currentQuestionIndex - 1]
  }

  private findResult(questionId: number) {
    return this.userResult.find(item => item.questionId === questionId);
  }

  protected move(action: ActionTestType): void {
    const existingResult = this.findResult(this.activeQuestion.id)

    if (this.chosenAnswerId()) {
      if (existingResult) {
        existingResult.chosenAnswerId = this.chosenAnswerId()!;
      } else {
        this.userResult.push({
          questionId: this.activeQuestion.id,
          chosenAnswerId: this.chosenAnswerId()!,
        });
      }
    }

    if (action === ActionTestType.PASS || action === ActionTestType.NEXT) {
      if (this.currentQuestionIndex === this.quiz.questions.length) {
        clearInterval(this.interval);
        this.complete();
        return;
      }

      this.currentQuestionIndex++;
    } else {
      this.currentQuestionIndex--;
    }

    const currentAnswer = this.findResult(this.activeQuestion.id)
    this.chosenAnswerId.set(currentAnswer?.chosenAnswerId ?? null);
  }

  complete() {
    const userInfo = this.authService.getUserInfo()
    if (userInfo) {
      this.testService.passQuiz(this.quiz.id, userInfo.userId, this.userResult)
        .subscribe(result => {
          if (result) {
            if ((result as DefaultResponseType).error) {
              console.log((result as DefaultResponseType).error)
            }
            this.router.navigate([`/result`], {queryParams: {id: this.quiz.id} });
          }
        })
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

export default TestComponent

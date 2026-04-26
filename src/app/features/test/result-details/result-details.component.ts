import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {TestService} from '../../../shared/services/test.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DefaultResponseType} from '../../../shared/types/default-response.type';
import {
  ResultDetailsAnswerType,
  ResultDetailsResponseType,
  ResultDetailsTestType
} from '../../../shared/types/result-details.type';

@Component({
  selector: 'app-result-details',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './result-details.component.html',
  styleUrl: './result-details.component.scss'
})
export class ResultDetailsComponent implements OnInit {
  authService = inject(AuthService);
  testService = inject(TestService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  quizId = ''
  test!: ResultDetailsTestType
  userInfo = this.authService.getUserInfo();

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (this.userInfo) {
          this.quizId = params['id']
          if (this.quizId) {
            this.testService.getResultDetails(this.quizId, this.userInfo.userId)
              .subscribe(result => {
                if (result) {
                  if ((result as DefaultResponseType).error) return console.log(result.error)
                  this.test = (result as ResultDetailsResponseType).test;
                }
              })
          }
        }
      })
  }

  isSkipped(answers: ResultDetailsAnswerType[]): boolean {
    return answers.every(a => a.correct === undefined);
  }
}

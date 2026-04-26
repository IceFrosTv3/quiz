import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TestService} from '../../../shared/services/test.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {DefaultResponseType} from '../../../shared/types/default-response.type';
import {PassTestResponseType} from '../../../shared/types/pass-test-response.type';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  testService = inject(TestService);
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  resultScore = ''
  quizId = ''

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          this.quizId = params['id']
          if (this.quizId) {
            this.testService.getResult(this.quizId, userInfo.userId)
              .subscribe(result => {
                if (result) {
                  if ((result as DefaultResponseType).error) {
                    console.log((result as DefaultResponseType).error)
                  }
                  this.resultScore = (result as PassTestResponseType).score + "/" + (result as PassTestResponseType).total
                }
              })
          }
        }
      })
  }
}

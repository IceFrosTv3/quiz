import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {QuizListType} from '../types/quiz-list.type';
import {TestResultType} from '../types/test-result.type';
import {DefaultResponseType} from '../types/default-response.type';
import {QuizType} from '../types/quiz.type';
import {UserResultTypes} from '../types/user-result.types';
import {PassTestResponseType} from '../types/pass-test-response.type';
import {ResultDetailsResponseType} from '../types/result-details.type';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  http = inject(HttpClient)

  getTests() {
    return this.http.get<QuizListType[]>(`${environment.apiHost}tests`)
  }

  getUserResults(userId: number) {
    return this.http.get<DefaultResponseType | TestResultType[]>(`${environment.apiHost}tests/results?userId=${userId}`)
  }

  getQuiz(id: number | string) {
    return this.http.get<DefaultResponseType | QuizType>(`${environment.apiHost}tests/${id}`)
  }

  passQuiz(id: number | string, userId: number, results: UserResultTypes[]) {
    return this.http.post<DefaultResponseType | PassTestResponseType>(`${environment.apiHost}tests/${id}/pass`, {
      userId,
      results,
    })
  }

  getResult(id: number | string, userId: number) {
    return this.http.get<DefaultResponseType | PassTestResponseType>(`${environment.apiHost}tests/${id}/result?userId=${userId}`)
  }

  getResultDetails(id: number | string, userId: number) {
    return this.http.get<DefaultResponseType | ResultDetailsResponseType>(`${environment.apiHost}tests/${id}/result/details?userId=${userId}`)
  }
}

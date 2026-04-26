import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputErrorDirective} from '../../../shared/directives/input-error.directive';
import {LoginResponseType} from '../../../shared/types/login-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SignupResponseType} from '../../../shared/types/signup-response.type';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputErrorDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly _snackBar = inject(MatSnackBar)
  private readonly router = inject(Router)

  signUpForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    agree: [false, Validators.requiredTrue]
  })

  signUp() {
    const emailValue = this.signUpForm.value.email;
    const passValue = this.signUpForm.value.password;
    const nameValue = this.signUpForm.value.name;
    const lastNameValue = this.signUpForm.value.lastName;

    // HTTP запрос регистрации, возвращает Observable
    if (this.signUpForm.valid && emailValue && passValue && nameValue && lastNameValue) {
      this.authService.signUp(emailValue, passValue, nameValue, lastNameValue)
        // применяем операторы к Observable
        .pipe(
          // получаем результат signUp, возвращаем новый Observable
          switchMap((result: SignupResponseType) => {
            // если сервер вернул ошибку в теле ответа
            if (result.error || !result.user) {
              this._snackBar.open('Error creating user');
              // уходим в error блок subscribe
              throw new Error(result.message || "Error creating user");
            }
            // возвращаем Observable логина, switchMap подпишется сам
            return this.authService.login(emailValue, passValue)
          })
        )
        .subscribe({
          // сюда приходит результат login, не signUp
          next: (result: LoginResponseType) => {
            if (result.error || !result.accessToken || !result.refreshToken
              || !result.fullName || !result.userId) {
              this._snackBar.open('Error with login credentials')
              throw new Error(result.message || "Error with login credentials");
            }

            this.router.navigate(['/choice'])
          },
          // сюда попадают ошибки и signUp и login
          error: (err: HttpErrorResponse) => {
            this._snackBar.open(err.error.message || 'Error')
            throw new Error(err.error.message);
          }
        })
    }
  }
}

import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {InputErrorDirective} from '../../../shared/directives/input-error.directive';
import {AuthService} from '../../../core/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginResponseType} from '../../../shared/types/login-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
    InputErrorDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly _snackBar = inject(MatSnackBar)

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
  })

  login() {
    const emailValue = this.loginForm.value.email;
    const passValue = this.loginForm.value.password;

    if (this.loginForm.valid && emailValue && passValue) {
      this.authService.login(emailValue, passValue)
        .subscribe({
          next: (result: LoginResponseType) => {
            if (result.error || !result.accessToken || !result.refreshToken
              || !result.fullName || !result.userId) {
              this._snackBar.open('Error with login credentials')
              throw new Error(result.message || "Error with login credentials");
            }

            this.router.navigate(['/choice'])
          },
          error: (err: HttpErrorResponse) => {
            this._snackBar.open(err.error.message || 'Error with login credentials')
            throw new Error(err.error.message);
          }
        })
    }
  }
}

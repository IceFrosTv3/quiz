import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly _snackBar = inject(MatSnackBar)
  authService = inject(AuthService)
  router = inject(Router)

  userInfo = toSignal(
    this.authService.isLogged$.pipe(
      map(isLogged => isLogged ? this.authService.getUserInfo() : null)
    )
  );

  // userInfo$ = this.authService.isLogged$.pipe(
  //   startWith(this.authService.loggedIn), // Берем начальное значение
  //   map(isLogged => isLogged ? this.authService.getUserInfo() : null)
  // );

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.removeTokens();
        this.authService.removeUserInfo()
        this._snackBar.open('Logout successfully', 'OK')
        this.router.navigate(['/'])
      },
      error: () => {
        this._snackBar.open('Error logging out');
      }
    })
  }

}

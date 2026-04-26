import {Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';


export const AUTH_ROUTES: Routes = [
  {path: 'signup', component: RegisterComponent,},
  {path: 'login', component: LoginComponent,},
]

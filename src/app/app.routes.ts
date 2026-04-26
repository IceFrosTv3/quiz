import {Routes} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './features/main/main.component';
import {authForwardGuard} from './core/auth/auth-forward.guard';
import {authGuard} from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
        canActivate: [authForwardGuard],
      },
      {
        path: '',
        loadChildren: () => import('./features/test/test.routes').then(m => m.TEST_ROUTES),
        canActivate: [authGuard],
      },
    ]
  }
];

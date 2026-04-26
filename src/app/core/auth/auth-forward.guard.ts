import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {Location} from '@angular/common';

export const authForwardGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const location = inject(Location)

  if (authService.loggedIn) {
    location.back()
    return false
  }

  return true;
};

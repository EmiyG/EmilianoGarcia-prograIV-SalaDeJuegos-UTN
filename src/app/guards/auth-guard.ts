import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async () => {

  const authService = inject(Auth);
  const router = inject(Router);

  const { data } =
    await authService.supabase.auth.getUser();

  if(data.user){

    return true;

  }

  router.navigateByUrl('/login');

  return false;

};
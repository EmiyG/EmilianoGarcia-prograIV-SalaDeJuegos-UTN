import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(Auth);
  const router = inject(Router);

  try {
    const { data } = await authService.supabase.auth.getUser();
    if (data.user && ['admin@test.com', 'user1@test.com', 'user2@test.com'].includes(data.user.email ?? '')) {
      return true;
    }
  } catch {
    return router.parseUrl('/login');
  }

  return router.parseUrl('/');
};

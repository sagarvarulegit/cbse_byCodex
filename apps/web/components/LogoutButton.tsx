'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { logoutAction } from '../app/auth-actions';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
          router.push('/');
          router.refresh();
        });
      }}
    >
      Logout
    </button>
  );
}

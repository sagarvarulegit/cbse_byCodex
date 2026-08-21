'use client';

import { useSearchParams } from 'next/navigation';

export function LoginErrorDisplay() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) return null;
  
  return <p className="auth-error">{error}</p>;
}

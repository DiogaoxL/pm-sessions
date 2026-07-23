import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Login - PM Sessions',
  description: 'Acesse a área administrativa do PM Sessions.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

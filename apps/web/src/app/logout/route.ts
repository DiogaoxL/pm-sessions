import { signOut } from '@/features/auth/actions/sign-out';

export async function GET() {
  await signOut();
}

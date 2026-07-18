/**
 * Supabase Integration Configurations
 * Centralizes read and validation of environment variables.
 */

export const supabaseConfig = {
  url: getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: getEnvOrThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: getEnvOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
};

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    // During Next.js build time, env variables might not be present.
    // We return placeholders to prevent the build from failing.
    const isBuildTime =
      process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production'; // Next.js sets NODE_ENV=production during build

    if (isBuildTime) {
      return 'placeholder';
    }

    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

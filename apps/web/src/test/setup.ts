// Vitest setup file
// Loaded before executing any test suites
import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';

// Define mock Supabase env variables to prevent initialization errors during tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key';

beforeAll(() => {
  // Global test setup runs here
});

afterAll(() => {
  // Global test teardown runs here
});

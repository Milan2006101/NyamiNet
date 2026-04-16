/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/Backend'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: './tsconfig.json',
      // Típusellenőrzés kikapcsolva, hogy a middleware global deklarációk
      // (pl. Request.auth az auth.ts-ből) ne okozzanak fordítási hibát.
      // A típusellenőrzést a `npm run build` (tsc) végzi.
      diagnostics: false,
    }],
  },
};

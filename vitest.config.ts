import { defineConfig } from 'vitest/config';

// La simulation d'équilibrage (sim/) se lance à part : SIM=1 npx vitest run
export default defineConfig({
  test: { include: process.env.SIM ? ['sim/**/*.test.ts'] : ['tests/**/*.test.ts', 'scripts/**/*.test.ts'] },
});

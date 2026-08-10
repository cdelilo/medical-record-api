import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    clearMocks: true,
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/config/test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/modules/*/services/*.ts'],
    },
  },
})

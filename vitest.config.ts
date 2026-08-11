import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    clearMocks: true,
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/configs/test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/modules/**/services/*.ts'],
    },
  },
})

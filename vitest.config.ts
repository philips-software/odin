import { defaultInclude, defineConfig } from 'vitest/config';
import { esbuildDecorators } from 'esbuild-decorators';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildDecorators(),
      ],
    },
  },
  test: {
    allowOnly: true,
    coverage: {
      all: true,
      clean: true,
      cleanOnRerun: true,
      provider: 'v8',
      reportsDirectory: 'test/.coverage',
      watermarks: {
        statements: [90, 100],
        branches: [90, 100],
        functions: [90, 100],
        lines: [90, 100],
      },
    },
    environment: 'node',
    globals: false,
    include: defaultInclude.map(include => `test/${include}`),
    isolate: true,
    passWithNoTests: false,
    reporters: 'verbose',
  },
});

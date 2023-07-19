import ts from 'typescript';
import { mergeConfig } from 'vite';
import { vitePluginTypescriptTransform } from 'vite-plugin-typescript-transform';
import { defaultExclude, defaultInclude, defineConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';

import viteConfiguration from './vite.config.js';

const vitestConfiguration = defineConfig({
  plugins: [
    vitePluginTypescriptTransform({
      enforce: 'pre',
      filter: {
        files: {
          include: /\.ts$/,
        },
      },
      tsconfig: {
        override: {
          target: ts.ScriptTarget.ES2021,
        },
      },
    }),
  ],
  test: {
    allowOnly: true,
    coverage: {
      all: true,
      clean: true,
      cleanOnRerun: true,
      provider: 'v8',
      reportsDirectory: '.coverage',
      watermarks: {
        statements: [90, 100],
        branches: [90, 100],
        functions: [90, 100],
        lines: [90, 100],
      },
    },
    deps: {
      experimentalOptimizer: {
        web: {
          enabled: true,
        },
        ssr: {
          enabled: true,
        },
      },
    },
    environment: 'node',
    globals: false,
    include: defaultInclude.map(include => `test/${include}`),
    exclude: [
      ...defaultExclude,
      'test/manual/**',
    ],
    isolate: true,
    passWithNoTests: false,
    reporters: 'verbose',
    setupFiles: [
      './test/setup/configuration.ts',
    ],
  },
}) as UserConfig;

export default mergeConfig(
  viteConfiguration,
  vitestConfiguration,
);

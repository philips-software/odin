import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

const sourcesDirectory = 'src';

export default defineConfig({
  build: {
    lib: {
      entry: sourcesDirectory,
      fileName: 'index',
      name: 'odin',
    },
    rollupOptions: {
      external: [
        'debug',
      ],
    },
  },
  plugins: [
    dts({
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        removeComments: false,
      },
      include: [
        sourcesDirectory,
      ],
      entryRoot: sourcesDirectory,
      insertTypesEntry: true,
      rollupTypes: true,
      strictOutput: true,
    }),
  ],
}) as UserConfig;

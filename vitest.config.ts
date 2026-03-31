import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    snapshotFormat: {
      maxOutputLength: 1e8,
    },
  },
});

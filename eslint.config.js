import { defineConfig, globalIgnores } from 'eslint/config';
import ts from 'eslint-config-cheminfo-typescript';

export default defineConfig(
  globalIgnores(['coverage', 'dist', 'lib']),
  ts,
  {
    // Manually-run profiling and data-fetching scripts: printing is their output.
    files: ['benchmark/**', 'script/**'],
    rules: { 'no-console': 'off' },
  },
  {
    // XML fixtures contain namespace URIs, which are identifiers and must be
    // reproduced verbatim.
    files: ['**/__tests__/**'],
    rules: { 'unicorn/prefer-https': 'off' },
  },
);

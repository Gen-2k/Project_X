import { nodeConfig } from '@project/eslint-config/node';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '.turbo/**',
      'docs/**',
      '**/eslint.config.*',
      '**/vite.config.*',
      '**/jest.config.*',
      '**/prisma.config.*',
      '**/commitlint.config.*',
    ],
  },
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['./*.js', './*.mjs', './*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);

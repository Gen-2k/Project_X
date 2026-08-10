import { reactConfig } from '@project/eslint-config/react';
import tseslint from 'typescript-eslint';

export default tseslint.config({ ignores: ['eslint.config.js', 'dist'] }, ...reactConfig, {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});

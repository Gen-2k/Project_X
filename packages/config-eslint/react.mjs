import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { baseConfig } from './base.mjs';

export const reactConfig = tseslint.config(...baseConfig, {
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  languageOptions: {
    globals: globals.browser,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
});

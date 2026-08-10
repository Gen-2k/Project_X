import globals from 'globals';
import tseslint from 'typescript-eslint';
import { baseConfig } from './base.mjs';

export const nodeConfig = tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    sourceType: 'commonjs',
  },
});

export default nodeConfig;

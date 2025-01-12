import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'consistent-return': 'warn', // Muudame 'error' -> 'warn'
      '@typescript-eslint/no-unused-vars': 'off', // Jätame välja lülitatuks
      '@typescript-eslint/no-unused-expressions': 'warn', // Muudame 'error' -> 'warn'
      '@typescript-eslint/no-explicit-any': 'off', // Ajutiselt keelame
      '@typescript-eslint/explicit-function-return-type': 'off', // Ajutiselt keelame
      'no-undef': 'warn', // Muudame 'error' -> 'warn'
      'no-unreachable': 'warn', // Muudame 'error' -> 'warn'
    },
  },
];


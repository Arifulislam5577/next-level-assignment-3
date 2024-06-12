import pluginJs from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { languageOptions: { globals: { ...globals.browser, process: true } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 1,
      'no-undef': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 1
    }
  }
]

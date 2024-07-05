import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['node_modules', '/build/*'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
        ...globals.es2015
      }
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/ban-types': [
        'error',
        {
          extendDefaults: true,
          types: {
            '{}': false
          }
        }
      ]
    }
  }
)

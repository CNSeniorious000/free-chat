import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  unocss: true,
  svelte: true,
  toml: false,
  lessOpinionated: true,
  formatters: { markdown: false },
  rules: {
    'e18e/prefer-static-regex': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'curly': 'off',
    'import/consistent-type-specifier-style': 'off',
    'jsonc/sort-keys': 'off',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-imports': ['error', { type: 'natural' }],
    'pnpm/yaml-enforce-settings': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'style/jsx-one-expression-per-line': 'off',
    'style/max-statements-per-line': 'off',
    'style/member-delimiter-style': 'off',
    'style/space-before-function-paren': ['error', 'never'],
    'svelte/html-quotes': ['error', { prefer: 'double' }],
    'unicorn/prefer-number-properties': 'off',
    'yaml/quotes': 'off',
  },
}, {
  files: ['**/*.md'],
  rules: {
    'perfectionist/sort-imports': 'off',
    'svelte/html-quotes': 'off',
  },
})

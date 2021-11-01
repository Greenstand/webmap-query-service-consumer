module.exports = {
  extends: [
    'airbnb-typescript/base',
    'prettier', // disable eslint formatting rules to prevent inconsistencies with prettier, should be last
  ],
  plugins: ['import'],
  parserOptions: { project: 'tsconfig.eslint.json' },
  reportUnusedDisableDirectives: true,
  rules: {
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
  },
}

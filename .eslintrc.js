module.exports = {
  extends: [
    'airbnb-typescript/base',
    // disable eslint formatting rules to prevent inconsistencies with prettier, should be last
    'prettier',
  ],
  plugins: ['import', 'simple-import-sort'],
  parserOptions: { project: 'tsconfig.json' },
  reportUnusedDisableDirectives: true,
  rules: {
    'no-redeclare': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
  },
}

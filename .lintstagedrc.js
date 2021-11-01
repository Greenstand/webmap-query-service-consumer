module.exports = {
  '*.{js,ts}': ['prettier --write', 'eslint --fix'], // run eslint last to prevent prettier from causing lint errors
  '*.{md,yml,yaml,json}': ['prettier --write'],
}

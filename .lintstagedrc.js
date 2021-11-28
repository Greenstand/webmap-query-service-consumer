module.exports = {
  '*': ['prettier --ignore-unknown --write'],
  '*.{ts}': ['eslint --fix --cache'], // run eslint last to prevent prettier from causing lint errors
}

module.exports = {
  '*': ['prettier --ignore-unknown --write'],
  '*.{js,ts}': ['eslint --fix --cache'], // run eslint last to prevent prettier from causing lint errors
}

const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'impr', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],
  },
};

export default config;

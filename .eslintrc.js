module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-irregular-whitespace': [
      'error',
      {
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true,
      },
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'spaced-comment': 'error',
  },
}

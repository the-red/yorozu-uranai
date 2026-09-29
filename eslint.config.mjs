import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const config = [
  ...nextVitals,
  prettier,
  {
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

      // eslint-plugin-react-hooks v7で追加されたルール。地図のページ（src/pages/map.tsx）が該当するので、警告にとどめる
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'coverage/**', 'next-env.d.ts'],
  },
]

export default config

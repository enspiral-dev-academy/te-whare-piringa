module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'standard'
  ],
  'plugins': [
    'standard',
    'promise',
    'react'
  ],
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': [
          '.js',
          '.jsx'
        ]
      }
    }
  },
  'rules': {
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': [
      'error', { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }
    ],
    'object-curly-spacing': [2, 'always'],
    'react/prop-types': 'off'
  }
}

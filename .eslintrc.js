module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  plugins: ['prettier', '@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'react-app',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],

      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        'import/no-extraneous-dependencies': [
          2,
          { devDependencies: ['**/*.test.*', '**/*.stories.*'] },
        ],
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'import/extensions': 'off',
        'jsx-a11y/anchor-is-valid': 'off',

        'react/jsx-filename-extension': 'off',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react/self-closing-comp': ['error'],

        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-unused-expressions': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
  rules: {
    quotes: [1, 'single'],
    'jsx-quotes': ['warn', 'prefer-double'],

    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/lib/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/components/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}

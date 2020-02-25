module.exports = {
    plugins: ['@typescript-eslint', 'jest'],
    parserOptions: {
        ecmaVersion: 8,
        sourceType: "module"
    },
    rules: {
        // If @typescript-eslint/no-unused-vars doesn't work well, we will have to re-enable the `noUnusedLocals` and
        // `noUnusedParameters` rules in `tsconfig.json` and let the TS compiler handle this rule
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'none',
                ignoreRestSiblings: true,
            },
        ],
        'jest/consistent-test-it': [
            'error',
            {
                fn: 'it',
                withinDescribe: 'it',
            },
        ],
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error',
    },
};

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'airbnb-base',
    overrides: [{
        env: {
            node: true,
        },
        files: [
            '.eslintrc.{js,cjs}',
        ],
        parserOptions: {
            sourceType: 'script',
        },
    }],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: 'off',
        'linebreak-style': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
        'max-len': 'off',
        'prefer-destructuring': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'no-use-before-define': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
    },
};

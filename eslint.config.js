import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
    {ignores: ['dist', 'node_modules', 'coverage']},
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@stylistic': stylistic,
            'simple-import-sort': simpleImportSort,
            'eslint-config-prettier': eslintConfigPrettier,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],
            '@stylistic/indent': ['error', 4],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/comma-style': ['error', 'last'],
            '@stylistic/max-len': ['error', {code: 120}],
            // spaces between braces
            '@stylistic/object-curly-spacing': ['error', 'always'],

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
)

import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';


export default [
    {files: ['**/*.{js,mjs,cjs,jsx}']},
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        'rules': {
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'linebreak-style': ['error', 'unix'],
            'no-var': ['error']
        }
    }
];
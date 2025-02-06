import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
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
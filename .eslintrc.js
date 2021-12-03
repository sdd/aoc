module.exports = {
    env: {
        es6: true,
        node: true,
        mocha: true,
    },
    parserOptions: {
        ecmaVersion: 9,
        ecmaFeatures: {
            jsx: false,
        },
    },

    extends: [
        // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
        'airbnb-base',

        // turn off rules that conflict with prettier
        'prettier',
    ],

    rules: {
        // POSSIBLE ERRORS ////

        // we should not be using Object.create(null) or
        // modifying the prototypes of builtins, so we
        // dont need this rule on.
        // https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'off',

        // if you are using await in a loop, you should
        // probably refactor to Promise.all so that you
        // are running your promises in parallel rather
        // than in series
        // https://eslint.org/docs/rules/no-await-in-loop
        'no-await-in-loop': 'warn',

        // catch some uncommon RegExp Unicode bugs
        // https://eslint.org/docs/rules/no-misleading-character-class
        'no-misleading-character-class': 'error',

        // prevent some rare but subtle and hard to track down
        // bugs when a variable gets assigned a new value
        // that depends on it's original value but the assignment
        // statement includes an await or yield.
        // https://eslint.org/docs/rules/require-atomic-updates
        'require-atomic-updates': 'error',

        // BEST PRACTICES ////

        // there are so many times where a class method may not want to use
        // this, that there is no point having this turned on.
        'class-methods-use-this': 'off',

        // this does not work well with koa middleware
        // https://eslint.org/docs/rules/consistent-return
        'consistent-return': 'off',

        // limit the cyclomatic complexity of a single function
        // only a warn at present - consider it a code smell
        // see https://eslint.org/docs/rules/complexity
        complexity: ['warn', { max: 20 }],

        // https://eslint.org/docs/rules/curly
        curly: 'error',

        // switch blocks should always have a default case,
        // even if this is just a comment - to show that the
        // developer has considered this situation.
        // https://eslint.org/docs/rules/default-case
        'default-case': 'error',

        // not enforced
        // https://eslint.org/docs/rules/dot-notation
        'dot-notation': 'off',

        // never use == or !=. Always === and !==.
        // prevents subtle errors due to type coercion, eg:
        //   [] == false
        //   [] == ![]
        //   3 == "03"
        eqeqeq: ['error', 'always'],

        // disallow alert(), confirm() and prompt().
        // this is not 1996.
        // https://eslint.org/docs/rules/no-alert
        'no-alert': 'error',

        // allow variables to be defined inside switch/case statements
        'no-case-declarations': 'off',

        // require escaping to prevent regexes that
        // look like division assignments
        // https://eslint.org/docs/rules/no-div-regex
        'no-div-regex': 'error',

        // global variables should be explicity set
        // on window or self to indicate that this is
        // the intended behaviour and not a mistake.
        // https://eslint.org/docs/rules/no-implicit-globals
        'no-implicit-globals': 'error',

        // if you are referring to `this` outside of
        // a class or object method, you have made a mistake.
        // https://eslint.org/docs/rules/no-invalid-this
        'no-invalid-this': 'error',

        // __iterator__ is obsolete legacy syntax.
        // https://eslint.org/docs/rules/no-iterator
        'no-iterator': 'error',

        // labels should only be used when `break`ing
        // from a nested loop to outside of the outer loop
        // (a rare case, and even avoiding this is usually
        // preferble)
        // https://eslint.org/docs/rules/no-labels
        'no-labels': ['error', { allowLoop: true }],

        // magic numbers should be declared as constants
        // and located at the top of the file, for
        // improved readablility and ease of refactoring
        // https://eslint.org/docs/rules/no-magic-numbers
        // 'no-magic-numbers': [
        //     'error',
        //     { ignore: [-2, -1, 0, 1, 2, 1000], ignoreArrayIndexes: true, enforceConst: true },
        // ],

        // not enforced. This is fine as long as you aren't
        // using the special arguments variable, usage of which
        // is much less common now that we have rest/spread
        'no-param-reassign': 'off',

        // if you are returning an awaited value, you are needlessly creating an
        // extra promise. the return value of an async function is always wrapped
        // in a promise if it is not one anyway. Await is only needed if you need
        // the value of a promise inside a function, rather than outside of it in
        // it's caller.
        // see https://eslint.org/docs/rules/no-return-await
        'no-return-await': 'error',

        // acceptable for testing a functions existence
        // before calling it by using short-circuit
        'no-unused-expressions': [
            'error',
            { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
        ],

        // ignore unused args, as this is often an indication that
        // a function conforms to an interface and that the unused
        // arg is available for future use
        'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],

        // async functions should only be used if you need to use await. They
        // introduce unnecessary overhead otherwise. If you simply want a func
        // that returns a promise of a value that was not awaited on, use return
        // Promise.resolve(blah).
        'require-await': 'error',

        // STYLISTIC ISSUES

        // usa of inc/dec is fine as semis are enforced
        'no-plusplus': 'off',

        // variable names should be camel cased, except
        // where destructuring something that comes
        // from a datasource that is not camelcased, eg a db
        camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }],

        // disallow certain syntax forms
        // https://eslint.org/docs/rules/no-restricted-syntax
        // We override airbnb's config here in order to allow for-of statements.
        // AirBnB's guidance on this is outdated, since V8 supports for-of
        // without the use of regenerator runtime in modern Chrome / Node
        // (see: https://kangax.github.io/compat-table/es6/#test-for..of_loops)
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],

        // ES6 RULES
        // as per AirBnB

        // VARIABLE RULES

        // don't allow undefined to be redefined
        // allow usage of undefined (but not redef of it, see below)
        // https://eslint.org/docs/rules/no-undefined
        'no-undefined': 'off',

        // dont allow redef of NaN, Infinity, undefined, etc
        'no-shadow-restricted-names': 'error',

        // allow use before define for function declarations
        'no-use-before-define': ['error', { functions: false, classes: false }],

        // NODE RULES
        'handle-callback-err': 'error',

        // IMPORT RULES

        // too many false positives
        'import/no-extraneous-dependencies': 'off',

        'import/namespace': 'error',
        'import/no-commonjs': 'off',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'index', 'sibling'],
                'newlines-between': 'ignore',
            },
        ],
    }
};

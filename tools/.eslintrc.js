module.exports = {
    parser: "babel-eslint",
    extends: "airbnb-base",
    plugins: [
        "import"
    ],
    env: {
        "browser": true,
        "node": true
    },
    globals: {
        "describe": false,
        "before": false,
        "after": false,
        "beforeEach": false,
        "afterEach": false,
        "it": false,
        "sinon": false
    },
    rules: {
        "indent": ["error", 4],
        "comma-dangle": 0,
        "no-underscore-dangle": 0,
        "no-alert": 0,
        "no-debugger": 0,
        "no-constant-condition": 0,
        "no-plusplus": 0,
        "no-param-reassign": 0,
        "no-unused-expressions": 0,
        "quote-props": 0,
        "class-methods-use-this": 0
    }
};
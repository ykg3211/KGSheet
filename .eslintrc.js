module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 7,
    sourceType: "module"
  },
  rules: {
    semi: [2, 'always'],
    quotes: 'single'
  },
  ignorePatterns: [
    "node_modules/",
  ]
};

module.exports = {
  root: true,
  extends: ["@byted-clm"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {},
  ignorePatterns: [
    "node_modules/",
    "*.js"
  ]
}

module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  rules: {
    semi: ['error', 'always'],
    // 関数の前にspace入れる規則OFF
    'space-before-function-paren': 'off',
    // consoleがあってもいい
    'no-console': 'off'
  }
}

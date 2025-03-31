module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:node/recommended' // Aktiviert die empfohlenen Regeln von eslint-plugin-node
    ],
    plugins: [
      'node' // Fügt eslint-plugin-node hinzu
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
        //'indent': ['error', 2], // Erzwingt 2 Leerzeichen für die Einrückung
        'semi': ['error', 'always'], // Erzwingt Semikolons am Ende von Anweisungen
        'no-unused-vars': 'warn', // Gibt eine Warnung für ungenutzte Variablen aus
        'no-console': 'off', // Deaktiviert die Regel, die console.log() verbietet.
      },
  };
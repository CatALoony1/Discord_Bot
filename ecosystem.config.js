module.exports = {
  apps: [
    {
      name: 'DiscordBot',
      script: 'src/index.js',
      watch: '.',
      ignore_watch: [
        'node_modules',
        '\\.git',
        'logs',
        '.gitignore',
        'package.json',
        'package-lock.json',
        'bot_database.db',
        'datenbank.db-journal',
        'datenbank.db-wal',
      ],
      restart_delay: 3000,
    },
  ],
};

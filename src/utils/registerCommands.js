const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const getFiles = (dir) => {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...getFiles(path.join(dir, item.name))];
    } else if (item.name.endsWith('.js')) {
      files.push(path.join(dir, item.name));
    }
  }
  return files;
};

/**
 * Registriert alle Slash-Commands bei Discord nur wenn Änderungen vorliegen
 * @param {string} guildId - Optionale Guild ID für sofortige Registrierung
 */
async function registerCommands(guildId) {
  const commands = [];
  const commandsPath = path.join(__dirname, '..', 'commands');
  const cachePath = path.join(__dirname, '..', '..', 'command-cache.json');
  if (!fs.existsSync(commandsPath)) return;
  const commandFiles = getFiles(commandsPath);
  for (const filePath of commandFiles) {
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);
    if (command.data) {
      commands.push(command.data.toJSON ? command.data.toJSON() : command.data);
    }
  }
  commands.sort((a, b) => a.name.localeCompare(b.name));
  const currentHash = crypto
    .createHash('md5')
    .update(JSON.stringify(commands))
    .digest('hex');
  if (fs.existsSync(cachePath)) {
    const previousHash = fs.readFileSync(cachePath, 'utf8');
    if (currentHash === previousHash) {
      console.log(
        '[System] Keine Änderungen an Befehlen erkannt. Überspringe API-Registrierung.',
      );
      return;
    }
  }
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    const clientId = process.env.CLIENT_ID;
    if (guildId) {
      console.log(
        `[System] Registering ${commands.length} commands for Guild: ${guildId}`,
      );
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
    } else {
      console.log(
        `[System] Registering ${commands.length} commands globally...`,
      );
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
    }
    fs.writeFileSync(cachePath, currentHash);
    console.log(
      '[System] Commands erfolgreich synchronisiert und Cache aktualisiert.',
    );
  } catch (error) {
    console.error('[Error] Fehler beim Registrieren der Commands:', error);
  }
}

module.exports = registerCommands;

const { SlashCommandBuilder, InteractionContextType} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vorschlag')
    .setDescription('Erstelle einen Vorschlag')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
  },
    options: {
        devOnly: false,
        deleted: true
    },
};
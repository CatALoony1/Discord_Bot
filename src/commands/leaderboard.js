const { SlashCommandBuilder, Client, Interaction, ActionRowBuilder, InteractionContextType, ButtonStyle, ButtonBuilder } = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../utils/calculateLevelXp');

const createLeaderboardEmbeds = require('../utils/createLeaderboardEmbeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Zeigt das Leaderboard.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }

    await interaction.deferReply();

    const embed = await createLeaderboardEmbeds(0, interaction);
    const pageDownButton = new ButtonBuilder()
      .setEmoji('⬅️')
      .setLabel('Zurück')
      .setStyle(ButtonStyle.Primary)
      .setCustomId(`lPageDown`);

    const pageUpButton = new ButtonBuilder()
      .setEmoji('➡️')
      .setLabel('Vorwärts')
      .setStyle(ButtonStyle.Primary)
      .setCustomId(`lPageUp`);

    const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton);

    interaction.editReply({
      embeds: [embed],
      components: [firstRow]
    })
  },
};
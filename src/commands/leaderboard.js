const { SlashCommandBuilder, ActionRowBuilder, InteractionContextType, ButtonStyle, ButtonBuilder } = require('discord.js');

const createLeaderboardEmbeds = require('../utils/createLeaderboardEmbeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Zeigt das Leaderboard.')
    .addStringOption(option =>
      option.setName('version')
        .setDescription('Die Version der Top 5')
        .setRequired(true)
        .addChoices(
          { name: 'XP', value: 'XP' },
          { name: 'Voice', value: 'Voice' },
          { name: 'Messages', value: 'Messages' }
        )
    )
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }
    const version = interaction.options.get('version').value;

    await interaction.deferReply();

    const embed = await createLeaderboardEmbeds(0, interaction, version);
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
    });
  },
};
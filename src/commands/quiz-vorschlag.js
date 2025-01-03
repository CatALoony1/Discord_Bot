const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz-vorschlag')
    .setDescription('Schlage eine Frage vor.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    try {
      const modal = new ModalBuilder()
        .setTitle('Schlage eine Frage vor.')
        .setCustomId(`qvorschlag-${interaction.user.id}`);
      const frageInput = new TextInputBuilder()
        .setCustomId('qvorschlag-frage')
        .setLabel('Frage:')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(300);
      const richtigInput = new TextInputBuilder()
        .setCustomId('qvorschlag-richtig')
        .setLabel('Richtige Antwort:')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const falsch1Input = new TextInputBuilder()
        .setCustomId('qvorschlag-falsch1')
        .setLabel('Falsche Antwort 1:')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const falsch2Input = new TextInputBuilder()
        .setCustomId('qvorschlag-falsch2')
        .setLabel('Falsche Antwort 2:')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const falsch3Input = new TextInputBuilder()
        .setCustomId('qvorschlag-falsch3')
        .setLabel('Falsche Antwort 3:')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const firstActionRow = new ActionRowBuilder().addComponents(frageInput);
      const secondActionRow = new ActionRowBuilder().addComponents(richtigInput);
      const thirdctionRow = new ActionRowBuilder().addComponents(falsch1Input);
      const fourthActionRow = new ActionRowBuilder().addComponents(falsch2Input);
      const fifthActionRow = new ActionRowBuilder().addComponents(falsch3Input);
      modal.addComponents(firstActionRow, secondActionRow, thirdctionRow, fourthActionRow, fifthActionRow);
      await interaction.showModal(modal);
    } catch (err) {
      console.log(err);
    }
  },
};
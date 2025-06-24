const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vorschlag')
    .setDescription('Erstelle einen Vorschlag')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    try {
      const modal = new ModalBuilder()
        .setTitle('Erstelle einen Vorschlag')
        .setCustomId(`suggestion-${interaction.user.id}`);
      const textInput = new TextInputBuilder()
        .setCustomId('suggestion-input')
        .setLabel('Was möchtest du vorschlagen?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);
      const actionRow = new ActionRowBuilder().addComponents(textInput);
      modal.addComponents(actionRow);
      await interaction.showModal(modal);
    } catch (err) {
      console.log(err);
    }
  },
    options: {
        devOnly: false,
        deleted: true
    },
};
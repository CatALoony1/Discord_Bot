const {
  SlashCommandBuilder,
  InteractionContextType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  LabelBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kummerkasten')
    .setDescription('Schreibe Nachricht an die Admins.')
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  run: async ({ interaction }) => {
    console.log(
      `SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`,
    );
    try {
      const modal = new ModalBuilder()
        .setTitle('Schreibe eine Nachricht.')
        .setCustomId(`feedback-${interaction.user.id}`);
      const textInput = new TextInputBuilder()
        .setCustomId('feedback-input')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);
      const textInputLabel = new LabelBuilder()
        .setLabel('Was möchtest du uns sagen?')
        .setTextInputComponent(textInput);
      const actionRow = new ActionRowBuilder().addComponents(textInputLabel);
      modal.addLabelComponents(actionRow);
      await interaction.showModal(modal);
    } catch (err) {
      console.log(err);
    }
  },
};

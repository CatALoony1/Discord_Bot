const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  LabelBuilder,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-quiz')
    .setDescription('Füge eine Frage hinzu'),

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction }) => {
    console.log(
      `SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`,
    );
    try {
      const mentionedUserId = interaction.user.id;
      const modal = new ModalBuilder()
        .setTitle('Trage eine Frage ein.')
        .setCustomId(`quizadd-${interaction.user.id}-${mentionedUserId}`);
      const frageInput = new TextInputBuilder()
        .setCustomId('quizadd-frage')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(300);
      const frageInputLabel = new LabelBuilder()
        .setLabel('Frage:')
        .setTextInputComponent(frageInput)
        .setDescription('Frage:');
      const richtigInput = new TextInputBuilder()
        .setCustomId('quizadd-richtig')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const richtigInputLabel = new LabelBuilder()
        .setLabel('Richtige Antwort:')
        .setTextInputComponent(richtigInput)
        .setDescription('Richtige Antwort:');
      const falsch1Input = new TextInputBuilder()
        .setCustomId('quizadd-falsch1')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const falsch1InputLabel = new LabelBuilder()
        .setLabel('Falsche Antwort 1:')
        .setTextInputComponent(falsch1Input)
        .setDescription('Falsche Antwort 1:');
      const falsch2Input = new TextInputBuilder()
        .setCustomId('quizadd-falsch2')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const falsch2InputLabel = new LabelBuilder()
        .setLabel('Falsche Antwort 2:')
        .setTextInputComponent(falsch2Input)
        .setDescription('Falsche Antwort 2:');
      const falsch3Input = new TextInputBuilder()
        .setCustomId('quizadd-falsch3')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(100);
      const falsch3InputLabel = new LabelBuilder()
        .setLabel('Falsche Antwort 3:')
        .setTextInputComponent(falsch3Input)
        .setDescription('Falsche Antwort 3:');
      const firstActionRow = new ActionRowBuilder().addComponents(
        frageInputLabel,
      );
      const secondActionRow = new ActionRowBuilder().addComponents(
        richtigInputLabel,
      );
      const thirdctionRow = new ActionRowBuilder().addComponents(
        falsch1InputLabel,
      );
      const fourthActionRow = new ActionRowBuilder().addComponents(
        falsch2InputLabel,
      );
      const fifthActionRow = new ActionRowBuilder().addComponents(
        falsch3InputLabel,
      );
      modal.addLabelComponents(
        frageInputLabel,
        richtigInputLabel,
        falsch1InputLabel,
        falsch2InputLabel,
        falsch3InputLabel,
      );
      await interaction.showModal(modal);
    } catch (err) {
      console.log(err);
    }
  },
  options: {
    devOnly: false,
  },
};

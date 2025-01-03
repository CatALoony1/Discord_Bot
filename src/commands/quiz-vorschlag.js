const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz-vorschlag')
    .setDescription('Schlage eine Frage vor.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    try {
      const targetUser = await interaction.guild.members.fetch(process.env.ADMIN_ID);
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
      const filter = (i) => i.customId === `qvorschlag-${interaction.user.id}`;
      const modalInteraction = await interaction.awaitModalSubmit({
        filter,
        time: 1000 * 60 * 3 //1sec * 60 *3 = 3min
      }).catch((error) => console.log(error));
      await modalInteraction.deferReply({ ephemeral: true })
      const frage = modalInteraction.fields.getTextInputValue('qvorschlag-frage');
      const richtig = modalInteraction.fields.getTextInputValue('qvorschlag-richtig');
      const falsch1 = modalInteraction.fields.getTextInputValue('qvorschlag-falsch1');
      const falsch2 = modalInteraction.fields.getTextInputValue('qvorschlag-falsch2');
      const falsch3 = modalInteraction.fields.getTextInputValue('qvorschlag-falsch3');
      const vorschlag = new EmbedBuilder();
      vorschlag.setColor(0x0033cc);
      vorschlag.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
      vorschlag.setTitle(`Fragen Vorschlag`);
      vorschlag.setDescription(frage);
      vorschlag.addFields({ name: `Richig:`, value: `${richtig}` });
      vorschlag.addFields({ name: `Falsch1:`, value: `${falsch1}` });
      vorschlag.addFields({ name: `Falsch2:`, value: `${falsch2}` });
      vorschlag.addFields({ name: `Falsch3:`, value: `${falsch3}` });
      await targetUser.send({ embeds: [vorschlag] });
      modalInteraction.editReply('Frage abgegeben!');
    } catch (err) {
      console.log(err);
    }
  },
};
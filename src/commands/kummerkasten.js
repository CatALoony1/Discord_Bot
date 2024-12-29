const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kummerkasten')
    .setDescription('Schreibe Nachricht an @Captains.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    try {
      const targetChannel = interaction.guild.channels.cache.get(process.env.KUMMERKASTEN_ID) || (await interaction.guild.channels.fetch(process.env.KUMMERKASTEN_ID));
      if (!targetChannel) {
        console.log('Fehler, kummerkasten channel gibts nicht');
        return;
      }
      const modal = new ModalBuilder()
        .setTitle('Schreibe eine Nachricht.')
        .setCustomId(`feedback-${interaction.user.id}`);
      const textInput = new TextInputBuilder()
        .setCustomId('feedback-input')
        .setLabel('Was möchtest du uns sagen?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);
      const actionRow = new ActionRowBuilder().addComponents(textInput);
      modal.addComponents(actionRow);
      await interaction.showModal(modal);
      const filter = (i) => i.customId === `feedback-${interaction.user.id}`;
      const modalInteraction = await interaction.awaitModalSubmit({
        filter,
        time: 1000 * 60 * 3 //1sec * 60 *3 = 3min
      }).catch((error) => console.log(error));
      await modalInteraction.deferReply({ ephemeral: true })
      const feedbackText = modalInteraction.fields.getTextInputValue('feedback-input');
      const feedback = new EmbedBuilder();
      feedback.setColor(0x0033cc);
      feedback.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
      feedback.setTimestamp(Date.now());
      feedback.setTitle(`Neue Kummerkasten Nachricht`);
      feedback.setDescription(feedbackText);
      await targetChannel.send({ embeds: [feedback] });
      modalInteraction.editReply('Nachricht eingeworfen!');
    } catch (err) {
      console.log(err);
    }
  },
};
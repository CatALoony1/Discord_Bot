const { MessageFlags, EmbedBuilder } = require('discord.js');
async function kummerkastenModal(interaction) {
  const targetChannel =
    interaction.guild.channels.cache.get(process.env.ADMIN_C_ID) ||
    (await interaction.guild.channels.fetch(process.env.ADMIN_C_ID));
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const feedbackText = interaction.fields.getTextInputValue('feedback-input');
  const feedback = new EmbedBuilder();
  feedback.setColor(0x0033cc);
  feedback.setAuthor({
    name: interaction.user.username,
    iconURL: interaction.user.displayAvatarURL({ size: 256 }),
  });
  feedback.setTimestamp(Date.now());
  feedback.setTitle(`Neue Kummerkasten Nachricht`);
  feedback.setDescription(feedbackText);
  await targetChannel.send({ embeds: [feedback] });
  interaction.editReply('Nachricht eingeworfen!');
}
module.exports = kummerkastenModal;

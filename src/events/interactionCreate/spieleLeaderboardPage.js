const { MessageFlags } = require('discord.js');
const createSpieleLeaderboardEmbeds = require('../../utils/createSpieleLeaderboardEmbeds');

module.exports = async (interaction) => {
  if (
    !interaction.isButton() ||
    !interaction.customId ||
    !interaction.customId.includes('spieleLeader')
  )
    return;
  let targetMessage = await interaction.channel.messages.fetch(
    interaction.message.id,
  );
  let targetMessageEmbed = targetMessage.embeds[0];
  let [page, maxpage] = targetMessageEmbed.description.split('/');
  if (interaction.customId === 'spieleLeaderDown') {
    try {
      if (page != 1) {
        let newPage = +page;
        await interaction.update({
          embeds: [
            await createSpieleLeaderboardEmbeds(newPage - 2, interaction),
          ],
          components: [targetMessage.components[0]],
        });
        return;
      } else {
        await interaction.reply({
          content: `Du bist bereits auf Seite 1.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  } else if (interaction.customId === 'spieleLeaderUp') {
    try {
      if (page != maxpage) {
        let newPage = +page;
        await interaction.update({
          embeds: [await createSpieleLeaderboardEmbeds(newPage, interaction)],
          components: [targetMessage.components[0]],
        });
        return;
      } else {
        await interaction.reply({
          content: `Du bist bereits auf der letzten Seite.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

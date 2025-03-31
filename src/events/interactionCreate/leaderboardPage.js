const { MessageFlags } = require('discord.js');
const createLeaderboardEmbeds = require("../../utils/createLeaderboardEmbeds");

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId) return;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [page, maxpage] = targetMessageEmbed.description.split("/");
    if (interaction.customId === 'lPageDown') {
        try {
            if (page != 1) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createLeaderboardEmbeds(newPage - 2, interaction)],
                    components: [targetMessage.components[0]]
                });
                return;
            } else {
                await interaction.editReply(`Du bist bereits auf Seite 1.`);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'lPageUp') {
        try {
            if (page != maxpage) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createLeaderboardEmbeds(newPage, interaction)],
                    components: [targetMessage.components[0]]
                });
                return;
            } else {
                await interaction.editReply(`Du bist bereits auf der letzten Seite.`);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
};